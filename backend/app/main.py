from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from io import BytesIO
from pathlib import Path
from uuid import uuid4

import polars as pl
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app import chart_query as cq
from app.models import (
    DatasetProfile,
    DatasetRows,
    DatasetSummary,
    ChartQueryRequest,
    ChartQueryResult,
)
from app.profiling import build_dataset_profile
from app.schema_detection import create_fields
from app.store import StoredDataset, datasets
from app.schema_detection import create_fields
from app.store import StoredDataset, datasets

# ===== CONSTANTS =============================================================
DEMO_DATASET_ID = "demo"
DEMO_DATASET_NAME = "Demo data"
DEMO_DATASET_PATH = Path(__file__).parent / "data" / "demo.csv"


# ===== DATASETS ==============================================================
def read_csv_frame(source: BytesIO | Path) -> pl.DataFrame:
    return pl.read_csv(
        source,
        try_parse_dates=True,
        infer_schema_length=1000,
        null_values=["", "-", "NA", "N/A", "null", "None"],
    )


def register_dataset(
    dataset_id: str,
    name: str,
    frame: pl.DataFrame,
) -> DatasetSummary:
    profile = build_dataset_profile(dataset_id, frame)
    summary = DatasetSummary(
        id=dataset_id,
        name=name,
        row_count=frame.height,
        fields=create_fields(profile),
    )
    datasets[dataset_id] = StoredDataset(
        summary=summary,
        profile=profile,
        frame=frame,
    )
    return summary


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    demo_frame = read_csv_frame(DEMO_DATASET_PATH)
    register_dataset(DEMO_DATASET_ID, DEMO_DATASET_NAME, demo_frame)
    yield


# ===== APP ==================================================================
app = FastAPI(title="CEVYN API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/datasets")
async def create_dataset(file: UploadFile) -> DatasetSummary:
    content = await file.read()
    frame = read_csv_frame(BytesIO(content))
    dataset_name = file.filename or "Untitled dataset"
    return register_dataset(str(uuid4()), dataset_name, frame)


@app.get("/datasets/{dataset_id}")
def get_dataset(dataset_id: str) -> DatasetSummary:
    stored_dataset = datasets.get(dataset_id)
    if stored_dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    return stored_dataset.summary


@app.get("/datasets/{dataset_id}/profile")
def get_dataset_profile(dataset_id: str) -> DatasetProfile:
    stored_dataset = datasets.get(dataset_id)
    if stored_dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    return stored_dataset.profile


@app.get("/datasets/{dataset_id}/rows")
def get_dataset_rows(
    dataset_id: str,
    offset: int = 0,
    limit: int = 100,
) -> DatasetRows:
    stored_dataset = datasets.get(dataset_id)
    if stored_dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    bounded_limit = min(limit, 500)
    frame_slice = stored_dataset.frame.slice(offset, bounded_limit)
    return DatasetRows(
        dataset_id=dataset_id,
        offset=offset,
        limit=bounded_limit,
        rows=frame_slice.to_dicts(),
    )


@app.post("/datasets/{dataset_id}/chart-query")
def query_chart(
    dataset_id: str,
    query: ChartQueryRequest,
) -> ChartQueryResult:
    stored = datasets.get(dataset_id)
    if stored is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    try:
        cq.validate_chart_query(stored.summary, query)
        return cq.build_chart_query_result(stored.frame, query)
    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        ) from error
