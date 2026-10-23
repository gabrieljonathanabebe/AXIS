import polars as pl
import pytest

from app.datasets.models import DatasetSummary
from app.queries import chart_query
from app.queries.models import (
    ChartQueryRequest,
    GroupAggregation,
    ValuesChartFilter,
)


# ===== AGGREGATE =============================================================
def test_text_x_is_sorted_by_total_descending(
    sales_frame: pl.DataFrame,
) -> None:
    """Categories come in order of their total, largest first."""
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        aggregation=GroupAggregation.SUM,
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    assert [(point.x, point.value) for point in result.points] == [
        ("US", 30.0),
        ("DE", 20.0),
        ("FR", 7.0),
    ]


def test_numeric_x_is_sorted_ascending_and_sent_as_text(
    sales_frame: pl.DataFrame,
) -> None:
    """A numeric X keeps its natural order; values arrive as text."""
    query = ChartQueryRequest(
        x="year",
        y="revenue",
        aggregation=GroupAggregation.SUM,
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    assert [(point.x, point.value) for point in result.points] == [
        ("2021", 22.0),
        ("2022", 35.0),
    ]


def test_series_splits_each_x_into_groups(sales_frame: pl.DataFrame) -> None:
    """With a series, every combination of X and series is one point."""
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        series="category",
        aggregation=GroupAggregation.SUM,
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    groups = {(point.x, point.series): point.value for point in result.points}
    assert groups == {
        ("US", "A"): 10.0,
        ("US", "B"): 20.0,
        ("DE", "A"): 20.0,
        ("FR", "B"): 7.0,
    }


def test_filters_apply_before_aggregation(sales_frame: pl.DataFrame) -> None:
    """A filtered chart aggregates only the matching rows."""
    query = ChartQueryRequest(
        x="category",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        filters=[
            ValuesChartFilter(kind="values", field="country", values=["DE"])
        ],
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    assert [(point.x, point.value) for point in result.points] == [("A", 20.0)]


# ===== VALIDATE ==============================================================
@pytest.mark.parametrize(
    ("query", "message"),
    [
        (
            ChartQueryRequest(
                x="country",
                y="category",
                aggregation=GroupAggregation.SUM,
            ),
            "Y must be numeric",
        ),
        (
            ChartQueryRequest(
                x="country",
                y="revenue",
                series="country",
                aggregation=GroupAggregation.SUM,
            ),
            "Series must differ from X",
        ),
        (
            ChartQueryRequest(
                x="country",
                y="revenue",
                color="year",
                aggregation=GroupAggregation.SUM,
            ),
            "set together",
        ),
    ],
)
def test_validate_chart_query_rejects_invalid_encodings(
    sales_summary: DatasetSummary,
    query: ChartQueryRequest,
    message: str,
) -> None:
    """Sums of text, a series equal to X and color without aggregation fail."""
    with pytest.raises(ValueError, match=message):
        chart_query.validate_chart_query(sales_summary, query)


def test_count_accepts_a_text_y(sales_summary: DatasetSummary) -> None:
    """Counting needs no numbers, so any field may be on Y."""
    query = ChartQueryRequest(
        x="country",
        y="category",
        aggregation=GroupAggregation.COUNT,
    )

    chart_query.validate_chart_query(sales_summary, query)
