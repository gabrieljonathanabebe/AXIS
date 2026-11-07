import polars as pl
import pytest

from app.datasets.models import DatasetSummary
from app.queries import table_query
from app.queries.models import TableQueryRequest, TableSort, ValuesChartFilter


# ===== TABLE =================================================================
def test_table_sorts_descending(sales_frame: pl.DataFrame) -> None:
    """A descending sort puts the largest value first."""
    query = TableQueryRequest(
        sort=TableSort(field="revenue", direction="desc")
    )

    result = table_query.build_table_query_result(sales_frame, query)

    assert [row["revenue"] for row in result.rows] == [20, 15, 10, 7, 5]


def test_table_keeps_ties_in_row_order(sales_frame: pl.DataFrame) -> None:
    """Equal sort values keep their order, so pages do not shuffle."""
    query = TableQueryRequest(sort=TableSort(field="country", direction="asc"))

    result = table_query.build_table_query_result(sales_frame, query)

    assert [row["revenue"] for row in result.rows] == [5, 15, 7, 10, 20]


@pytest.mark.parametrize(
    ("direction", "expected"),
    [("asc", [1.0, 3.0, None]), ("desc", [3.0, 1.0, None])],
)
def test_table_puts_missing_values_last(
    direction: str,
    expected: list[float | None],
) -> None:
    """Rows without a value come last in both directions."""
    frame = pl.DataFrame({"revenue": [3.0, None, 1.0]})
    query = TableQueryRequest(
        sort=TableSort(field="revenue", direction=direction)
    )

    result = table_query.build_table_query_result(frame, query)

    assert [row["revenue"] for row in result.rows] == expected


def test_table_pages_after_filtering(sales_frame: pl.DataFrame) -> None:
    """Offset and limit apply to the filtered rows, the count to all."""
    query = TableQueryRequest(
        filters=[
            ValuesChartFilter(kind="values", field="category", values=["A"])
        ],
        limit=1,
        offset=1,
    )

    result = table_query.build_table_query_result(sales_frame, query)

    assert [row["revenue"] for row in result.rows] == [5.0]
    assert result.total_count == 3


def test_table_caps_the_page_size() -> None:
    """A page never holds more than MAX_TABLE_ROWS rows."""
    frame = pl.DataFrame({"id": range(table_query.MAX_TABLE_ROWS + 100)})
    query = TableQueryRequest(limit=table_query.MAX_TABLE_ROWS * 2)

    result = table_query.build_table_query_result(frame, query)

    assert len(result.rows) == table_query.MAX_TABLE_ROWS
    assert result.total_count == table_query.MAX_TABLE_ROWS + 100


def test_table_rejects_unknown_sort_field(
    sales_summary: DatasetSummary,
) -> None:
    """Sorting by a field the dataset does not have is rejected."""
    query = TableQueryRequest(sort=TableSort(field="city", direction="asc"))

    with pytest.raises(ValueError, match="Unknown field: city"):
        table_query.validate_table_query(sales_summary, query)


def test_table_rejects_negative_offset(sales_summary: DatasetSummary) -> None:
    """A page cannot start before the first row."""
    query = TableQueryRequest(offset=-1)

    with pytest.raises(ValueError, match="Offset must be 0 or more"):
        table_query.validate_table_query(sales_summary, query)


# ===== FIELD VALUES ==========================================================
def test_field_values_most_frequent_first(sales_frame: pl.DataFrame) -> None:
    """Values come by count; equal counts in alphabetical order."""
    result = table_query.build_field_values(sales_frame, "country", "", 100)

    assert [(item.value, item.count) for item in result.values] == [
        ("DE", 2),
        ("US", 2),
        ("FR", 1),
    ]
    assert result.total_count == 3


def test_field_values_search_ignores_case(sales_frame: pl.DataFrame) -> None:
    """The search finds values regardless of upper and lower case."""
    result = table_query.build_field_values(sales_frame, "country", "us", 100)

    assert [item.value for item in result.values] == ["US"]


def test_field_values_leave_out_missing_values() -> None:
    """A missing value cannot be selected, so it is not listed."""
    frame = pl.DataFrame({"country": ["US", None, "DE", None]})

    result = table_query.build_field_values(frame, "country", "", 100)

    assert [item.value for item in result.values] == ["DE", "US"]
    assert result.total_count == 2


def test_field_values_limit_keeps_the_total(sales_frame: pl.DataFrame) -> None:
    """The limit shortens the list, the total still counts all values."""
    result = table_query.build_field_values(sales_frame, "country", "", 1)

    assert len(result.values) == 1
    assert result.total_count == 3


@pytest.mark.parametrize("limit", [0, -1])
def test_field_values_reject_a_limit_below_one(limit: int) -> None:
    """A negative limit would list all values but the last."""
    with pytest.raises(ValueError, match="Limit must be at least 1."):
        table_query.validate_field_values(limit)
