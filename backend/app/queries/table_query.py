import polars as pl

from app.datasets import profiling
from app.datasets.models import DatasetSummary, ValueCount
from app.queries import filters
from app.queries.models import (
    FieldValues,
    TableQueryRequest,
    TableQueryResult,
)

MAX_TABLE_ROWS = 500
MAX_FIELD_VALUES = 100


def build_table_query_result(
    frame: pl.DataFrame,
    query: TableQueryRequest,
) -> TableQueryResult:
    """
    Filter, sort and page the dataset for one table request.
    Args:
        frame: Full dataset of the request.
        query: Filters, sort, offset and limit from the table.
    Returns:
        One page of rows and the row count after filtering; the stable
        sort keeps ties in the same order across pages.
    """
    filtered = filters.apply_filters(frame, query.filters)
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
    """Reject unknown fields, invalid filters and negative paging."""
    filters.validate_filters(summary, query.filters)
    fields = {field.name: field for field in summary.fields}
    if query.sort is not None and query.sort.field not in fields:
        raise ValueError(f"Unknown field: {query.sort.field}")
    if query.offset < 0 or query.limit < 1:
        raise ValueError("Offset must be 0 or more and limit at least 1.")


def build_field_values(
    frame: pl.DataFrame,
    field_name: str,
    search: str,
    limit: int,
) -> FieldValues:
    """
    List the most frequent values of a field for the table's values filter.
    Args:
        frame: Full dataset of the request.
        field_name: Field whose values are listed.
        search: Case-insensitive text the values must contain.
        limit: Maximum number of values, capped at MAX_FIELD_VALUES.
    Returns:
        Values with counts and the number of all matches; nulls are left
        out because they cannot be selected.
    """
    values = frame.get_column(field_name).drop_nulls().cast(pl.String)
    if search:
        matches = values.str.to_lowercase().str.contains(
            search.lower(),
            literal=True,
        )
        values = values.filter(matches)
    counts = profiling.count_values(values)
    shown = counts.head(min(limit, MAX_FIELD_VALUES))
    return FieldValues(
        field=field_name,
        total_count=counts.height,
        values=[
            ValueCount(value=value, count=count)
            for value, count in shown.iter_rows()
        ],
    )
