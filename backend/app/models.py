from enum import StrEnum
from typing import Any

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


class Field(BaseModel):
    name: str
    physical_type: PhysicalType
    semantic_type: SemanticType


class DatasetSummary(BaseModel):
    id: str
    name: str
    row_count: int
    fields: list[Field]


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


class ChartQueryRequest(BaseModel):
    x: str
    y: str
    series: str | None = None
    color: str | None = None
    color_aggregation: GroupAggregation | None = None
    aggregation: GroupAggregation


class ChartQueryPoint(BaseModel):
    x: str | None
    series: str | None
    value: float | None
    color_value: float | None = None


class ChartQueryResult(BaseModel):
    points: list[ChartQueryPoint]
