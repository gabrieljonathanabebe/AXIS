from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel


class PhysicalType(StrEnum):
    INTEGER = "integer"
    FLOAT = "float"
    STRING = "string"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"


class SemanticType(StrEnum):
    NUMERICAL = "numeric"
    CATEGORIAL = "categorical"
    TEMPORAL = "temporal"
    IDENTIFIER = "identifier"


class SemanticRole(StrEnum):
    MEASURE = "measure"
    DIMENSION = "dimension"
    TEMPORAL = "temporal"
    IDENTIFIER = "identifier"


class Field(BaseModel):
    name: str
    physical_type: PhysicalType
    semantic_type: SemanticType


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


class DatasetRows(BaseModel):
    dataset_id: str
    offset: int
    limit: int
    rows: list[dict[str, Any]]


class GroupAggregation(StrEnum):
    SUM = "sum"
    MEAN = "mean"
    MEDIAN = "median"
    MIN = "min"
    MAX = "max"
    COUNT = "count"


class ValuesChartFilter(BaseModel):
    kind: Literal["values"]
    field: str
    values: list[str]


class RangeChartFilter(BaseModel):
    kind: Literal["range"]
    field: str
    min: float
    max: float


ChartFilter = ValuesChartFilter | RangeChartFilter


class ChartQueryRequest(BaseModel):
    x: str
    y: str
    series: str | None = None
    color: str | None = None
    color_aggregation: GroupAggregation | None = None
    aggregation: GroupAggregation
    filters: list[ChartFilter] = []


class ChartQueryPoint(BaseModel):
    x: str | None
    series: str | None
    value: float | None
    color_value: float | None = None


class ChartQueryResult(BaseModel):
    points: list[ChartQueryPoint]
