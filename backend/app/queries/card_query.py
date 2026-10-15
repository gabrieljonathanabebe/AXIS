import polars as pl

from app.datasets.models import DatasetSummary, PhysicalType
from app.queries import filters
from app.queries.chart_query import build_aggregation_expression
from app.queries.models import (
    CardQueryRequest,
    CardQueryResult,
    GroupAggregation,
)


def build_card_query_result(
    frame: pl.DataFrame,
    query: CardQueryRequest,
) -> CardQueryResult:
    """
    Filter the dataset and aggregate it to the single value of a card.
    Args:
        frame: Full dataset of the request.
        query: Field, aggregation and filters of the card.
    Returns:
        The aggregated value; without a field, the number of rows.
    """
    filtered = filters.apply_filters(frame, query.filters)
    if query.field is None:
        return CardQueryResult(value=filtered.height)
    aggregated = filtered.select(
        build_aggregation_expression(query.field, query.aggregation, "value")
    )
    return CardQueryResult(value=aggregated.item())


def validate_card_query(
    summary: DatasetSummary,
    query: CardQueryRequest,
) -> None:
    """
    Check that field, aggregation and filters form a valid card query.
    Args:
        summary: Dataset whose fields the query addresses.
        query: Field, aggregation and filters of the card.
    Raises:
        ValueError: If the field is unknown, missing for an aggregation
            other than count or not numeric where the aggregation needs
            numbers.
    """
    fields = {field.name: field for field in summary.fields}
    is_count = query.aggregation is GroupAggregation.COUNT
    if query.field is None:
        if not is_count:
            raise ValueError("Without a field, a card can only count rows.")
    elif query.field not in fields:
        raise ValueError(f"Unknown field: {query.field}")
    elif not is_count and fields[query.field].physical_type not in (
        PhysicalType.INTEGER,
        PhysicalType.FLOAT,
    ):
        raise ValueError("Field must be numeric for this aggregation.")
    filters.validate_filters(summary, query.filters)
