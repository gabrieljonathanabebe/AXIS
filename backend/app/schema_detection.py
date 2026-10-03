import polars as pl

from app.models import (
    DatasetProfile,
    Field,
    PhysicalType,
    SemanticRole,
)

INTEGER_DTYPES = {
    pl.Int8,
    pl.Int16,
    pl.Int32,
    pl.Int64,
    pl.UInt8,
    pl.UInt16,
    pl.UInt32,
    pl.UInt64,
}

FLOAT_DTYPES = {
    pl.Float32,
    pl.Float64,
}


def infer_physical_type(dtype: pl.DataType) -> PhysicalType:
    if dtype in INTEGER_DTYPES:
        return PhysicalType.INTEGER
    if dtype in FLOAT_DTYPES:
        return PhysicalType.FLOAT
    if dtype == pl.Boolean:
        return PhysicalType.BOOLEAN
    if dtype == pl.Date:
        return PhysicalType.DATE
    if dtype == pl.Datetime:
        return PhysicalType.DATETIME
    return PhysicalType.STRING


MIN_IDENTIFIER_ROWS = 50


def infer_semantic_role(
    name: str,
    physical_type: PhysicalType,
    unique_count: int,
    value_count: int,
) -> SemanticRole:
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
    return [
        Field(
            name=field.name,
            physical_type=field.physical_type,
            semantic_role=field.semantic_role,
        )
        for field in profile.fields
    ]
