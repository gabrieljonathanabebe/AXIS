from enum import StrEnum
from typing import Literal

from pydantic import BaseModel


# ===== TYPES =================================================================
class PhysicalType(StrEnum):
    """Storage type of a column, derived from its Polars dtype."""

    INTEGER = "integer"
    FLOAT = "float"
    STRING = "string"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"


class SemanticRole(StrEnum):
    """Analytical meaning of a field; decides how charts may use it."""

    MEASURE = "measure"
    DIMENSION = "dimension"
    TEMPORAL = "temporal"
    IDENTIFIER = "identifier"


class TemporalGranularity(StrEnum):
    """Most common step between consecutive dates of a field."""

    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"


# ===== DATASET ===============================================================
class Field(BaseModel):
    """Name, physical type and detected semantic role of a column."""

    name: str
    physical_type: PhysicalType
    semantic_role: SemanticRole


class DatasetSummary(BaseModel):
    """Id, name, row count and fields the frontend works with."""

    id: str
    name: str
    row_count: int
    fields: list[Field]


# ===== STATISTICS ============================================================
class ValueCount(BaseModel):
    """A value as text and how often it occurs."""

    value: str
    count: int


class MeasureStatistics(BaseModel):
    """Range, center and distribution of a numeric field."""

    kind: Literal["measure"] = "measure"
    min: float | None
    max: float | None
    mean: float | None
    median: float | None
    histogram: list[int]


class DimensionStatistics(BaseModel):
    """Most frequent values of a categorical field."""

    kind: Literal["dimension"] = "dimension"
    value_counts: list[ValueCount]


class TemporalStatistics(BaseModel):
    """Date range as ISO text, granularity and distribution of a field."""

    kind: Literal["temporal"] = "temporal"
    min: str | None
    max: str | None
    granularity: TemporalGranularity | None
    histogram: list[int]


FieldStatistics = MeasureStatistics | DimensionStatistics | TemporalStatistics


# ===== PROFILE ===============================================================
class FieldProfile(BaseModel):
    """Profile of one field; statistics follow the detected role."""

    name: str
    physical_type: PhysicalType
    semantic_role: SemanticRole
    missing_count: int
    unique_count: int
    statistics: FieldStatistics | None


class DatasetProfile(BaseModel):
    """Deterministic profile of a dataset, computed once at upload."""

    dataset_id: str
    row_count: int
    column_count: int
    missing_count: int
    duplicate_rows: int
    fields: list[FieldProfile]
