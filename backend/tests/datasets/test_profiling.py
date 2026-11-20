import polars as pl

from app.datasets import profiling, store
from app.datasets.models import DatasetSummary, SemanticRole


# ===== FIELD PROFILE =========================================================
def test_identifier_profile_has_counts_but_no_statistics() -> None:
    """
    Current state: an identifier keeps its counts on the field and gets
    no statistics at all.
    """
    column = pl.Series("order_id", ["a", "b", "b", None])

    field = profiling.build_field_profile(column)

    assert field.semantic_role == SemanticRole.IDENTIFIER
    assert (field.missing_count, field.unique_count) == (1, 2)
    assert field.statistics is None


# ===== DATASET PROFILE =======================================================
def test_summary_and_profile_both_carry_id_and_row_count(
    sales_summary: DatasetSummary,
) -> None:
    """Current state: summary and profile each store id and row count."""
    profile = store.datasets[sales_summary.id].profile

    assert (sales_summary.id, sales_summary.row_count) == ("test-sales", 5)
    assert (profile.dataset_id, profile.row_count) == ("test-sales", 5)
