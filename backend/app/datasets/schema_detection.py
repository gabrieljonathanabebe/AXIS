import polars as pl

from app.datasets.models import (
    DatasetProfile,
    Field,
    PhysicalType,
    SemanticRole,
)

# ===== CONSTANTS =============================================================
# Text columns this long or longer count as identifiers if all values differ.
MIN_IDENTIFIER_ROWS = 50


# ===== FUNCTIONS =============================================================
def infer_physical_type(dtype: pl.DataType) -> PhysicalType:
    """Map a Polars dtype to a physical type; unknown dtypes become string."""
    if dtype.is_integer():
        return PhysicalType.INTEGER
    if dtype.is_float():
        return PhysicalType.FLOAT
    if dtype == pl.Boolean:
        return PhysicalType.BOOLEAN
    if dtype == pl.Date:
        return PhysicalType.DATE
    if dtype == pl.Datetime:
        return PhysicalType.DATETIME
    return PhysicalType.STRING


def infer_semantic_role(
    name: str,
    physical_type: PhysicalType,
    unique_count: int,
    value_count: int,
) -> SemanticRole:
    """
    Guess the analytical role of a field from its name, type and values.
    Args:
        name: Column name; "id" or a "_id" suffix marks an identifier.
        physical_type: Physical type of the column.
        unique_count: Number of distinct non-null values.
        value_count: Number of non-null values.
    Returns:
        Identifier, temporal, measure or dimension, checked in this order.
    """
    lowered_name = name.lower()
    if lowered_name.endswith("_id") or lowered_name == "id":
        return SemanticRole.IDENTIFIER
    if physical_type in {PhysicalType.DATE, PhysicalType.DATETIME}:
        return SemanticRole.TEMPORAL
    if (
        physical_type == PhysicalType.STRING
        and value_count >= MIN_IDENTIFIER_ROWS
        and unique_count == value_count
    ):
        return SemanticRole.IDENTIFIER
    if physical_type in {PhysicalType.INTEGER, PhysicalType.FLOAT}:
        return SemanticRole.MEASURE
    return SemanticRole.DIMENSION


def create_fields(profile: DatasetProfile) -> list[Field]:
    """Reduce the field profiles to the fields of the dataset summary."""
    return [
        Field(
            name=field.name,
            physical_type=field.physical_type,
            semantic_role=field.semantic_role,
        )
        for field in profile.fields
    ]
