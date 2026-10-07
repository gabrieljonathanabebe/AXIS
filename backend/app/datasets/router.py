from io import BytesIO
from uuid import uuid4

from fastapi import APIRouter, UploadFile

from app.datasets import store
from app.datasets.dependencies import StoredDatasetDep
from app.datasets.models import DatasetProfile, DatasetSummary

router = APIRouter(prefix="/datasets", tags=["datasets"])


@router.post("")
async def create_dataset(file: UploadFile) -> DatasetSummary:
    """Store an uploaded CSV file as a new dataset."""
    content = await file.read()
    frame = store.read_csv_frame(BytesIO(content))
    dataset_name = file.filename or "Untitled dataset"
    return store.register_dataset(str(uuid4()), dataset_name, frame)


@router.get("/{dataset_id}")
def get_dataset(stored: StoredDatasetDep) -> DatasetSummary:
    """Return the fields and row count of a dataset."""
    return stored.summary


@router.get("/{dataset_id}/profile")
def get_dataset_profile(stored: StoredDatasetDep) -> DatasetProfile:
    """Return the statistics profile computed at upload."""
    return stored.profile
