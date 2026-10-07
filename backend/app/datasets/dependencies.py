from typing import Annotated

from fastapi import Depends, HTTPException

from app.datasets import store


def get_stored_dataset(dataset_id: str) -> store.StoredDataset:
    """
    Look up the dataset addressed by the request path.
    Args:
        dataset_id: Dataset id from the URL.
    Returns:
        The stored dataset.
    Raises:
        HTTPException: 404 if no dataset has this id.
    """
    stored = store.datasets.get(dataset_id)
    if stored is None:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    return stored


StoredDatasetDep = Annotated[store.StoredDataset, Depends(get_stored_dataset)]
