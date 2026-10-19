from collections.abc import Iterator

import polars as pl
import pytest
from fastapi.testclient import TestClient

from app.datasets import store
from app.datasets.models import DatasetSummary
from app.main import app

# ===== CONSTANTS =============================================================
SALES_DATASET_ID = "test-sales"


# ===== FIXTURES ==============================================================
@pytest.fixture
def sales_frame() -> pl.DataFrame:
    """
    Five sales rows, small enough to check every result by hand.
    Returns:
        Columns country and category (text), year (integer) and revenue
        (float). Revenue sums to US 30, DE 20, FR 7.
    """
    return pl.DataFrame(
        {
            "country": ["US", "US", "DE", "DE", "FR"],
            "category": ["A", "B", "A", "A", "B"],
            "year": [2021, 2022, 2021, 2022, 2021],
            "revenue": [10.0, 20.0, 5.0, 15.0, 7.0],
        }
    )


@pytest.fixture
def sales_summary(sales_frame: pl.DataFrame) -> Iterator[DatasetSummary]:
    """
    Register the sales rows in the in-memory store for one test.
    Args:
        sales_frame: Rows to register.
    Returns:
        The summary with the detected fields; the dataset is removed
        from the store after the test.
    """
    summary = store.register_dataset(SALES_DATASET_ID, "Sales", sales_frame)
    yield summary
    store.datasets.pop(SALES_DATASET_ID, None)


@pytest.fixture
def client() -> Iterator[TestClient]:
    """
    Run the API in-process; the lifespan loads the demo dataset.
    Returns:
        A client that sends requests to the app without a server.
    """
    with TestClient(app) as test_client:
        yield test_client
