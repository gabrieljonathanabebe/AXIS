import polars as pl
import pytest

from app.datasets.models import DatasetSummary
from app.queries import filters
from app.queries.models import RangeChartFilter, ValuesChartFilter


# ===== APPLY =================================================================
def test_values_filter_keeps_matching_rows(sales_frame: pl.DataFrame) -> None:
    """A values filter keeps the rows whose field is one of the values."""
    items = [ValuesChartFilter(kind="values", field="country", values=["US"])]

    result = filters.apply_filters(sales_frame, items)

    assert result["revenue"].to_list() == [10.0, 20.0]


def test_values_filter_matches_numbers_as_text(
    sales_frame: pl.DataFrame,
) -> None:
    """Numbers are compared as text, as the frontend sends them."""
    items = [ValuesChartFilter(kind="values", field="year", values=["2021"])]

    result = filters.apply_filters(sales_frame, items)

    assert result.height == 3


@pytest.mark.parametrize(
    ("minimum", "maximum", "expected"),
    [
        (10.0, None, [10.0, 20.0, 15.0]),
        (None, 7.0, [5.0, 7.0]),
        (8.0, 16.0, [10.0, 15.0]),
    ],
)
def test_range_filter_keeps_values_within_bounds(
    sales_frame: pl.DataFrame,
    minimum: float | None,
    maximum: float | None,
    expected: list[float],
) -> None:
    """A range includes its bounds; a missing bound leaves that side open."""
    items = [
        RangeChartFilter(
            kind="range",
            field="revenue",
            min=minimum,
            max=maximum,
        )
    ]

    result = filters.apply_filters(sales_frame, items)

    assert result["revenue"].to_list() == expected


def test_filters_combine_with_and(sales_frame: pl.DataFrame) -> None:
    """Every filter must match, e.g. country US and revenue from 15."""
    items = [
        ValuesChartFilter(kind="values", field="country", values=["US"]),
        RangeChartFilter(kind="range", field="revenue", min=15.0),
    ]

    result = filters.apply_filters(sales_frame, items)

    assert result["revenue"].to_list() == [20.0]


# ===== VALIDATE ==============================================================
@pytest.mark.parametrize(
    ("item", "message"),
    [
        (
            ValuesChartFilter(kind="values", field="city", values=["Rome"]),
            "Unknown field",
        ),
        (
            RangeChartFilter(kind="range", field="country", min=1.0),
            "numeric field",
        ),
        (
            RangeChartFilter(kind="range", field="revenue"),
            "min or max",
        ),
    ],
)
def test_validate_filters_rejects_invalid_filters(
    sales_summary: DatasetSummary,
    item: ValuesChartFilter | RangeChartFilter,
    message: str,
) -> None:
    """Unknown fields, ranges on text and ranges without bounds fail."""
    with pytest.raises(ValueError, match=message):
        filters.validate_filters(sales_summary, [item])
