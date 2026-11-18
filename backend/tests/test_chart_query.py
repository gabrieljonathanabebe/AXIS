from datetime import date, datetime

import polars as pl
import pytest

from app.datasets.models import DatasetSummary, TimeGrain
from app.queries import chart_query
from app.queries.models import (
    ChartQueryRequest,
    DateRangeFilter,
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


# ===== TIME GRAIN ============================================================
@pytest.mark.parametrize(
    ("time_grain", "expected"),
    [
        (
            TimeGrain.DAY,
            [
                ("2025-03-10", 1.0),
                ("2025-03-16", 2.0),
                ("2025-03-17", 4.0),
                ("2025-04-02", 8.0),
            ],
        ),
        (
            TimeGrain.WEEK,
            [("2025-03-10", 3.0), ("2025-03-17", 4.0), ("2025-03-31", 8.0)],
        ),
        (
            TimeGrain.MONTH,
            [("2025-03-01", 7.0), ("2025-04-01", 8.0)],
        ),
        (
            TimeGrain.QUARTER,
            [("2025-01-01", 7.0), ("2025-04-01", 8.0)],
        ),
        (TimeGrain.YEAR, [("2025-01-01", 15.0)]),
    ],
)
def test_time_grain_groups_dates_by_period(
    time_grain: TimeGrain,
    expected: list[tuple[str, float]],
) -> None:
    """Dates group by the start of their period; weeks start on Monday."""
    frame = pl.DataFrame(
        {
            "date": [
                date(2025, 3, 10),
                date(2025, 3, 16),
                date(2025, 3, 17),
                date(2025, 4, 2),
            ],
            "revenue": [1.0, 2.0, 4.0, 8.0],
        }
    )
    query = ChartQueryRequest(
        x="date",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        time_grain=time_grain,
    )

    result = chart_query.build_chart_query_result(frame, query)

    assert [(point.x, point.value) for point in result.points] == expected


def test_time_grain_keeps_datetimes_on_their_day() -> None:
    """Times at the edge of a day stay on the day written in the data."""
    frame = pl.DataFrame(
        {
            "date": [
                datetime(2025, 3, 1, 0, 30),
                datetime(2025, 3, 1, 23, 30),
            ],
            "revenue": [1.0, 2.0],
        }
    )
    query = ChartQueryRequest(
        x="date",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        time_grain=TimeGrain.DAY,
    )

    result = chart_query.build_chart_query_result(frame, query)

    assert [(point.x, point.value) for point in result.points] == [
        ("2025-03-01", 3.0)
    ]


def test_validate_chart_query_rejects_a_time_grain_without_dates(
    sales_summary: DatasetSummary,
) -> None:
    """A time grain on a text X fails."""
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        time_grain=TimeGrain.MONTH,
    )

    with pytest.raises(ValueError, match="Time grain needs a date field"):
        chart_query.validate_chart_query(sales_summary, query)


def test_date_range_filter_keeps_the_whole_period() -> None:
    """A selected month keeps every row of it, also late on its last day."""
    frame = pl.DataFrame(
        {
            "date": [
                datetime(2025, 2, 28, 23, 0),
                datetime(2025, 3, 1, 0, 30),
                datetime(2025, 3, 31, 23, 30),
                datetime(2025, 4, 1, 0, 0),
            ],
            "revenue": [1.0, 2.0, 4.0, 8.0],
        }
    )
    query = ChartQueryRequest(
        x="date",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        time_grain=TimeGrain.MONTH,
        filters=[
            DateRangeFilter(
                kind="date_range",
                field="date",
                start=date(2025, 3, 1),
                end=date(2025, 3, 31),
            )
        ],
    )

    result = chart_query.build_chart_query_result(frame, query)

    assert [(point.x, point.value) for point in result.points] == [
        ("2025-03-01", 6.0)
    ]
