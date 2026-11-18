from datetime import date, datetime

import polars as pl
import pytest

from app.datasets.models import DatasetSummary, TimeGrain
from app.queries import chart_query
from app.queries.models import (
    ChartLimit,
    ChartQueryRequest,
    ChartSort,
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


# ===== SORT AND LIMIT ========================================================
@pytest.mark.parametrize(
    ("sort", "expected"),
    [
        (ChartSort(by="value", order="desc"), ["US", "DE", "FR"]),
        (ChartSort(by="value", order="asc"), ["FR", "DE", "US"]),
        (ChartSort(by="category", order="asc"), ["DE", "FR", "US"]),
        (ChartSort(by="category", order="desc"), ["US", "FR", "DE"]),
    ],
)
def test_sort_orders_categories_by_value_or_name(
    sales_frame: pl.DataFrame,
    sort: ChartSort,
    expected: list[str],
) -> None:
    """Categories follow their total or their name, in either direction."""
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        sort=sort,
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    assert [point.x for point in result.points] == expected


def test_sort_by_name_ignores_case_and_puts_no_category_last() -> None:
    """Lower case names sort among the others; no category comes last."""
    frame = pl.DataFrame(
        {
            "country": [None, "US", "at", "DE"],
            "revenue": [9.0, 1.0, 2.0, 3.0],
        }
    )
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        sort=ChartSort(by="category", order="desc"),
    )

    result = chart_query.build_chart_query_result(frame, query)

    assert [point.x for point in result.points] == ["US", "DE", "at", None]


@pytest.mark.parametrize(
    ("limit", "expected"),
    [
        (ChartLimit(kind="top", count=2), ["US", "DE"]),
        (ChartLimit(kind="bottom", count=2), ["DE", "FR"]),
        (ChartLimit(kind="top", count=10), ["US", "DE", "FR"]),
    ],
)
def test_limit_keeps_the_largest_or_smallest_categories(
    sales_frame: pl.DataFrame,
    limit: ChartLimit,
    expected: list[str],
) -> None:
    """Top and bottom pick by total; the default sort orders the rest."""
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        limit=limit,
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    assert [point.x for point in result.points] == expected


def test_limit_with_series_picks_by_total_of_all_series(
    sales_frame: pl.DataFrame,
) -> None:
    """US wins with 10 + 20, although DE has the largest single group."""
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        series="category",
        aggregation=GroupAggregation.SUM,
        limit=ChartLimit(kind="top", count=1),
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    assert [
        (point.x, point.series, point.value) for point in result.points
    ] == [("US", "A", 10.0), ("US", "B", 20.0)]


def test_bottom_with_series_sorted_by_value_ascending(
    sales_frame: pl.DataFrame,
) -> None:
    """The two smallest totals, smallest first, series kept together."""
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        series="category",
        aggregation=GroupAggregation.SUM,
        sort=ChartSort(by="value", order="asc"),
        limit=ChartLimit(kind="bottom", count=2),
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    assert [(point.x, point.series) for point in result.points] == [
        ("FR", "B"),
        ("DE", "A"),
    ]


def test_date_x_stays_in_chronological_order() -> None:
    """Dates keep their order, also when a later month has more revenue."""
    frame = pl.DataFrame(
        {
            "date": [date(2025, 1, 5), date(2025, 2, 5)],
            "revenue": [1.0, 5.0],
        }
    )
    query = ChartQueryRequest(
        x="date",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        time_grain=TimeGrain.MONTH,
    )

    result = chart_query.build_chart_query_result(frame, query)

    assert [point.x for point in result.points] == [
        "2025-01-01",
        "2025-02-01",
    ]


def test_categories_keep_selection_and_order_under_a_filter(
    sales_frame: pl.DataFrame,
) -> None:
    """The highlight shows the base categories in their order, filtered."""
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        categories=["FR", "DE", "US"],
        filters=[
            ValuesChartFilter(kind="values", field="category", values=["B"])
        ],
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    assert [(point.x, point.value) for point in result.points] == [
        ("FR", 7.0),
        ("US", 20.0),
    ]


def test_categories_leave_out_categories_of_other_charts(
    sales_frame: pl.DataFrame,
) -> None:
    """Categories outside the list stay hidden, even with a larger value."""
    query = ChartQueryRequest(
        x="country",
        y="revenue",
        aggregation=GroupAggregation.SUM,
        categories=["DE", "FR"],
    )

    result = chart_query.build_chart_query_result(sales_frame, query)

    assert [point.x for point in result.points] == ["DE", "FR"]


def test_boolean_category_matches_its_values_filter() -> None:
    """A boolean X arrives as the text a selection filters with."""
    frame = pl.DataFrame(
        {
            "is_result": [True, False, True],
            "revenue": [1.0, 2.0, 3.0],
        }
    )
    query = ChartQueryRequest(
        x="is_result",
        y="revenue",
        aggregation=GroupAggregation.SUM,
    )
    base = chart_query.build_chart_query_result(frame, query)
    selected = base.points[0].x
    assert selected is not None
    highlight = query.model_copy(
        update={
            "filters": [
                ValuesChartFilter(
                    kind="values",
                    field="is_result",
                    values=[selected],
                )
            ]
        }
    )

    result = chart_query.build_chart_query_result(frame, highlight)

    assert selected == "true"
    assert [(point.x, point.value) for point in result.points] == [
        ("true", 4.0)
    ]


@pytest.mark.parametrize(
    ("query", "message"),
    [
        (
            ChartQueryRequest(
                x="year",
                y="revenue",
                aggregation=GroupAggregation.SUM,
                sort=ChartSort(by="value", order="desc"),
            ),
            "Category order needs a text or boolean X",
        ),
        (
            ChartQueryRequest(
                x="country",
                y="revenue",
                aggregation=GroupAggregation.SUM,
                limit=ChartLimit(kind="top", count=5),
                categories=["US"],
            ),
            "Limit and categories cannot be combined",
        ),
    ],
)
def test_validate_chart_query_rejects_invalid_category_order(
    sales_summary: DatasetSummary,
    query: ChartQueryRequest,
    message: str,
) -> None:
    """Sort on a numeric X and limit next to categories fail."""
    with pytest.raises(ValueError, match=message):
        chart_query.validate_chart_query(sales_summary, query)
