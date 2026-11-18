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


class TimeGrain(StrEnum):
    """Step in which dates are grouped: native on a field, chosen on a chart."""

    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"


# ===== DATASET ===============================================================
class Field(BaseModel):
    """
    What the app needs to work with a column: name, physical type, detected
    semantic role and native time grain (None without dates). Values that
    only describe the column stay in its statistics.
    """

    name: str
    physical_type: PhysicalType
    semantic_role: SemanticRole
    native_grain: TimeGrain | None


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
    """Date range as ISO text and distribution of a field."""

    kind: Literal["temporal"] = "temporal"
    min: str | None
    max: str | None
    histogram: list[int]


FieldStatistics = MeasureStatistics | DimensionStatistics | TemporalStatistics


class FieldProfile(Field):
    """A field with the statistics of its values; they follow the role."""

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
