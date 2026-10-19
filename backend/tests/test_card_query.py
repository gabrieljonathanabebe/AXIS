import polars as pl
import pytest

from app.datasets.models import DatasetSummary
from app.queries import card_query
from app.queries.models import (
    CardQueryRequest,
    GroupAggregation,
    ValuesChartFilter,
)


# ===== AGGREGATE =============================================================
def test_card_without_field_counts_rows(sales_frame: pl.DataFrame) -> None:
    """Without a field, a card shows the number of rows."""
    query = CardQueryRequest(aggregation=GroupAggregation.COUNT)

    result = card_query.build_card_query_result(sales_frame, query)

    assert result.value == 5


def test_card_follows_the_selection(sales_frame: pl.DataFrame) -> None:
    """A selected value, e.g. a clicked bar, filters the card."""
    query = CardQueryRequest(
        field="revenue",
        aggregation=GroupAggregation.SUM,
        filters=[
            ValuesChartFilter(kind="values", field="country", values=["DE"])
        ],
    )

    result = card_query.build_card_query_result(sales_frame, query)

    assert result.value == 20.0


def test_card_without_matching_rows_has_no_mean(
    sales_frame: pl.DataFrame,
) -> None:
    """A mean of no rows is None, which the card shows as a dash."""
    query = CardQueryRequest(
        field="revenue",
        aggregation=GroupAggregation.MEAN,
        filters=[
            ValuesChartFilter(kind="values", field="country", values=["IT"])
        ],
    )

    result = card_query.build_card_query_result(sales_frame, query)

    assert result.value is None


# ===== VALIDATE ==============================================================
@pytest.mark.parametrize(
    ("query", "message"),
    [
        (
            CardQueryRequest(aggregation=GroupAggregation.SUM),
            "only count rows",
        ),
        (
            CardQueryRequest(field="city", aggregation=GroupAggregation.SUM),
            "Unknown field",
        ),
        (
            CardQueryRequest(
                field="country",
                aggregation=GroupAggregation.SUM,
            ),
            "must be numeric",
        ),
    ],
)
def test_validate_card_query_rejects_invalid_queries(
    sales_summary: DatasetSummary,
    query: CardQueryRequest,
    message: str,
) -> None:
    """A sum needs a known, numeric field."""
    with pytest.raises(ValueError, match=message):
        card_query.validate_card_query(sales_summary, query)
