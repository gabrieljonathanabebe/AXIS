import httpx
import pytest
from fastapi.testclient import TestClient


# ===== UPLOAD ================================================================
def upload_csv(client: TestClient, content: bytes) -> httpx.Response:
    """
    Send a file to the upload endpoint.
    Args:
        client: Client of the running app.
        content: Raw file content.
    Returns:
        The response of the upload.
    """
    return client.post(
        "/datasets",
        files={"file": ("sales.csv", content, "text/csv")},
    )


def test_upload_registers_a_readable_csv(client: TestClient) -> None:
    """A valid CSV becomes a dataset with its rows and fields."""
    response = upload_csv(client, b"country,revenue\nUS,10\nDE,5\n")

    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "sales.csv"
    assert body["row_count"] == 2
    assert [field["name"] for field in body["fields"]] == [
        "country",
        "revenue",
    ]


@pytest.mark.parametrize(
    ("content", "message"),
    [
        (b"", "could not be read as CSV"),
        (bytes(range(256)) * 4, "could not be read as CSV"),
        (b"a,b\n1,2,3\n", "could not be read as CSV"),
        (b"country,revenue\n", "no data rows"),
    ],
    ids=["empty", "binary", "extra column", "header only"],
)
def test_upload_rejects_unusable_files_with_a_message(
    client: TestClient,
    content: bytes,
    message: str,
) -> None:
    """Unusable files answer 422 with a reason instead of a server error."""
    response = upload_csv(client, content)

    assert response.status_code == 422
    assert message in response.json()["detail"]
