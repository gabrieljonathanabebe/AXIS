from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

import polars as pl

from app.datasets import profiling, schema_detection
from app.datasets.models import DatasetProfile, DatasetSummary

# ===== CONSTANTS =============================================================
DEMO_DATASET_ID = "demo"
DEMO_DATASET_NAME = "Demo data"
DEMO_DATASET_PATH = Path(__file__).parent / "data" / "demo.csv"


# ===== STATE =================================================================
@dataclass
class StoredDataset:
    """A loaded dataset: summary and profile for the API, frame for queries."""

    summary: DatasetSummary
    profile: DatasetProfile
    frame: pl.DataFrame


# In-memory store by dataset id; empty again after a server restart.
datasets: dict[str, StoredDataset] = {}


# ===== FUNCTIONS =============================================================


def read_csv_frame(source: BytesIO | Path) -> pl.DataFrame:
    """
    Read a CSV file into a DataFrame with typed columns.
    Args:
        source: Uploaded file content or path to a CSV file.
    Returns:
        The rows, with detected dates and common null markers as nulls.
    """
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
    """
    Profile a DataFrame and keep it in the in-memory store.
    Args:
        dataset_id: Id under which the dataset is stored.
        name: Display name, usually the file name.
        frame: Rows of the dataset.
    Returns:
        The summary the frontend receives for the dataset.
    """
    profile = profiling.build_dataset_profile(dataset_id, frame)
    summary = DatasetSummary(
        id=dataset_id,
        name=name,
        row_count=frame.height,
        fields=schema_detection.create_fields(profile),
    )
    datasets[dataset_id] = StoredDataset(
        summary=summary,
        profile=profile,
        frame=frame,
    )
    return summary


def register_demo_dataset() -> DatasetSummary:
    """Load the bundled demo CSV and store it under the id `demo`."""
    frame = read_csv_frame(DEMO_DATASET_PATH)
    return register_dataset(DEMO_DATASET_ID, DEMO_DATASET_NAME, frame)
