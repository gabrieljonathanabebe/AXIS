from fastapi.testclient import TestClient

from app.datasets import store

# ===== CONSTANTS =============================================================
CARD_QUERY_URL = f"/datasets/{store.DEMO_DATASET_ID}/card-query"


# ===== TESTS =================================================================
def test_health(client: TestClient) -> None:
    """The server reports that it runs."""
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_demo_dataset_is_loaded_on_start(client: TestClient) -> None:
    """The lifespan registers the demo dataset under its fixed id."""
    response = client.get(f"/datasets/{store.DEMO_DATASET_ID}")

    assert response.status_code == 200
    assert response.json()["row_count"] > 0


def test_card_query_filters_the_demo_dataset(client: TestClient) -> None:
    """A filtered card counts fewer rows than the whole dataset."""
    total = client.post(CARD_QUERY_URL, json={"aggregation": "count"})
    filtered = client.post(
        CARD_QUERY_URL,
        json={
            "aggregation": "count",
            "filters": [
                {
                    "kind": "values",
                    "field": "country",
                    "values": ["France"],
                }
            ],
        },
    )

    assert total.status_code == 200
    assert filtered.status_code == 200
    assert 0 < filtered.json()["value"] < total.json()["value"]


def test_invalid_query_answers_422_with_message(client: TestClient) -> None:
    """Validation errors reach the client as 422 with their message."""
    response = client.post(
        CARD_QUERY_URL,
        json={"field": "city", "aggregation": "sum"},
    )

    assert response.status_code == 422
    assert response.json() == {"detail": "Unknown field: city"}


def test_unknown_dataset_answers_404(client: TestClient) -> None:
    """A request for a dataset that is not loaded is not found."""
    response = client.post(
        "/datasets/missing/card-query",
        json={"aggregation": "count"},
    )

    assert response.status_code == 404
