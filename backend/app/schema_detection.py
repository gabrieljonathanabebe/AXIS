import polars as pl

from app.models import Field, PhysicalType, SemanticType

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


def infer_semantic_type(name: str, physical_type: PhysicalType) -> SemanticType:
    lowered_name = name.lower()
    if lowered_name.endswith("_id") or lowered_name == "id":
        return SemanticType.IDENTIFIER
    if physical_type in {PhysicalType.INTEGER, PhysicalType.FLOAT}:
        return SemanticType.NUMERICAL
    if physical_type in {
        PhysicalType.DATE,
        PhysicalType.DATETIME,
    }:
        return SemanticType.TEMPORAL
    return SemanticType.CATEGORIAL


def infer_fields(frame: pl.DataFrame) -> list[Field]:
    fields: list[Field] = []
    for col_name, dtype in frame.schema.items():
        physical_type = infer_physical_type(dtype)
        semantic_type = infer_semantic_type(col_name, physical_type)
        fields.append(
            Field(
                name=col_name,
                physical_type=physical_type,
                semantic_type=semantic_type,
            )
        )
    return fields
