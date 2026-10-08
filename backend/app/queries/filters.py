from collections.abc import Sequence

import polars as pl

from app.datasets.models import DatasetSummary, PhysicalType
from app.queries.models import (
    DateRangeTableFilter,
    RangeChartFilter,
    TableFilter,
)


def build_bounds_expression(
    column: pl.Expr,
    lower: object | None,
    upper: object | None,
) -> pl.Expr:
    """
    Build a range condition where one open bound becomes a single comparison.
    Args:
        column: Column, or derived expression, to compare.
        lower: Smallest allowed value, or None for no lower bound.
        upper: Largest allowed value, or None for no upper bound.
    Returns:
        A boolean expression; at least one bound must be set.
    """
    if lower is None:
        return column <= upper
    if upper is None:
        return column >= lower
    return column.is_between(lower, upper)


def build_filter_expression(item: TableFilter) -> pl.Expr:
    """
    Turn one filter into a Polars condition.
    Args:
        item: Values filter (matched as text), numeric range or date range;
            datetimes compare by their date, like the table's date steps.
    Returns:
        A boolean expression for frame.filter.
    """
    if isinstance(item, RangeChartFilter):
        return build_bounds_expression(pl.col(item.field), item.min, item.max)
    if isinstance(item, DateRangeTableFilter):
        column = pl.col(item.field).cast(pl.Date)
        return build_bounds_expression(column, item.start, item.end)
    return pl.col(item.field).cast(pl.Utf8).is_in(item.values)


def apply_filters(
    frame: pl.DataFrame,
    items: Sequence[TableFilter],
) -> pl.DataFrame:
    """
    Keep only the rows that match every filter.
    Args:
        frame: Rows to filter.
        items: Filters, combined with AND.
    Returns:
        The matching rows.
    """
    for item in items:
        frame = frame.filter(build_filter_expression(item))
    return frame


def validate_filters(
    summary: DatasetSummary,
    items: Sequence[TableFilter],
) -> None:
    """
    Check that every filter targets a known field of a fitting type.
    Args:
        summary: Dataset whose fields the filters address.
        items: Filters from a chart or table request.
    Raises:
        ValueError: If a field is unknown, a range has no bound or the
            field type does not fit the filter.
    """
    fields = {field.name: field for field in summary.fields}
    for item in items:
        if item.field not in fields:
            raise ValueError(f"Unknown field: {item.field}")
        physical_type = fields[item.field].physical_type
        if isinstance(item, RangeChartFilter):
            if item.min is None and item.max is None:
                raise ValueError("Range filters need a min or max.")
            if physical_type not in (PhysicalType.INTEGER, PhysicalType.FLOAT):
                raise ValueError("Range filters require a numeric field.")
        if isinstance(item, DateRangeTableFilter):
            if item.start is None and item.end is None:
                raise ValueError("Date ranges need a start or end.")
            if physical_type not in (PhysicalType.DATE, PhysicalType.DATETIME):
                raise ValueError("Date ranges require a date field.")
