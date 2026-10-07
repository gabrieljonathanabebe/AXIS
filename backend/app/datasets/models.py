from enum import StrEnum
from typing import Literal

from pydantic import BaseModel


class PhysicalType(StrEnum):
    INTEGER = "integer"
    FLOAT = "float"
    STRING = "string"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"


class SemanticRole(StrEnum):
    MEASURE = "measure"
    DIMENSION = "dimension"
    TEMPORAL = "temporal"
    IDENTIFIER = "identifier"


class TemporalGranularity(StrEnum):
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"


class Field(BaseModel):
    name: str
    physical_type: PhysicalType
    semantic_role: SemanticRole


class DatasetSummary(BaseModel):
    id: str
    name: str
    row_count: int
    fields: list[Field]


class MeasureStatistics(BaseModel):
    kind: Literal["measure"] = "measure"
    min: float | None
    max: float | None
    mean: float | None
    median: float | None
    histogram: list[int]


class ValueCount(BaseModel):
    value: str
    count: int


class DimensionStatistics(BaseModel):
    kind: Literal["dimension"] = "dimension"
    value_counts: list[ValueCount]


class TemporalStatistics(BaseModel):
    kind: Literal["temporal"] = "temporal"
    min: str | None
    max: str | None
    granularity: TemporalGranularity | None
    histogram: list[int]


FieldStatistics = MeasureStatistics | DimensionStatistics | TemporalStatistics


class FieldProfile(BaseModel):
    name: str
    physical_type: PhysicalType
    semantic_role: SemanticRole
    missing_count: int
    unique_count: int
    statistics: FieldStatistics | None


class DatasetProfile(BaseModel):
    dataset_id: str
    row_count: int
    column_count: int
    missing_count: int
    duplicate_rows: int
    fields: list[FieldProfile]
