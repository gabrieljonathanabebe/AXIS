import polars as pl

from app import chart_query as cq
from app.models import (
    DatasetSummary,
    DateRangeTableFilter,
    FieldValues,
    PhysicalType,
    TableFilter,
    TableQueryRequest,
    TableQueryResult,
    ValueCount,
)
from app.profiling import count_values

MAX_TABLE_ROWS = 500
MAX_FIELD_VALUES = 100


# Datetimes compare by their date, like the date steps of the slider.
def build_table_filter_expression(table_filter: TableFilter) -> pl.Expr:
    if not isinstance(table_filter, DateRangeTableFilter):
        return cq.build_filter_expression(table_filter)
    return cq.build_bounds_expression(
        pl.col(table_filter.field).cast(pl.Date),
        table_filter.start,
        table_filter.end,
    )


# Stable sort keeps ties in the same order across pages.
def build_table_query_result(
    frame: pl.DataFrame,
    query: TableQueryRequest,
) -> TableQueryResult:
    filtered = frame
    for item in query.filters:
        filtered = filtered.filter(build_table_filter_expression(item))
    if query.sort is not None:
        filtered = filtered.sort(
            query.sort.field,
            descending=query.sort.direction == "desc",
            maintain_order=True,
            nulls_last=True,
        )
    limit = min(query.limit, MAX_TABLE_ROWS)
    return TableQueryResult(
        offset=query.offset,
        rows=filtered.slice(query.offset, limit).to_dicts(),
        total_count=filtered.height,
    )


def validate_table_query(
    summary: DatasetSummary,
    query: TableQueryRequest,
) -> None:
    cq.validate_filters(summary, query.filters)
    fields = {field.name: field for field in summary.fields}
    for item in query.filters:
        if not isinstance(item, DateRangeTableFilter):
            continue
        if item.start is None and item.end is None:
            raise ValueError("Date ranges need a start or end.")
        if fields[item.field].physical_type not in (
            PhysicalType.DATE,
            PhysicalType.DATETIME,
        ):
            raise ValueError("Date ranges require a date field.")
    if query.sort is not None and query.sort.field not in fields:
        raise ValueError(f"Unknown field: {query.sort.field}")
    if query.offset < 0 or query.limit < 1:
        raise ValueError("Offset must be 0 or more and limit at least 1.")


# Values for the table's values filter; nulls cannot be selected.
def build_field_values(
    frame: pl.DataFrame,
    field_name: str,
    search: str,
    limit: int,
) -> FieldValues:
    values = frame.get_column(field_name).drop_nulls().cast(pl.String)
    if search:
        matches = values.str.to_lowercase().str.contains(
            search.lower(),
            literal=True,
        )
        values = values.filter(matches)
    counts = count_values(values)
    shown = counts.head(min(limit, MAX_FIELD_VALUES))
    return FieldValues(
        field=field_name,
        total_count=counts.height,
        values=[
            ValueCount(value=value, count=count)
            for value, count in shown.iter_rows()
        ],
    )
