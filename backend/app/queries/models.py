from datetime import date
from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel

from app.datasets.models import ValueCount


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
    min: float | None = None
    max: float | None = None


ChartFilter = ValuesChartFilter | RangeChartFilter


# Table only; open bounds are None.
class DateRangeTableFilter(BaseModel):
    kind: Literal["date_range"]
    field: str
    start: date | None = None
    end: date | None = None


TableFilter = ChartFilter | DateRangeTableFilter


class ChartQueryRequest(BaseModel):
    x: str
    y: str
    series: str | None = None
    color: str | None = None
    color_aggregation: GroupAggregation | None = None
    aggregation: GroupAggregation
    filters: list[ChartFilter] = []


class PointsQueryRequest(BaseModel):
    fields: list[str]


class PointsQueryResult(BaseModel):
    rows: list[dict[str, Any]]
    total_count: int


class ChartQueryPoint(BaseModel):
    x: str | None
    series: str | None
    value: float | None
    color_value: float | None = None


class ChartQueryResult(BaseModel):
    points: list[ChartQueryPoint]


class TableSort(BaseModel):
    direction: Literal["asc", "desc"]
    field: str


class TableQueryRequest(BaseModel):
    filters: list[TableFilter] = []
    limit: int = 100
    offset: int = 0
    sort: TableSort | None = None


class TableQueryResult(BaseModel):
    offset: int
    rows: list[dict[str, Any]]
    total_count: int


class FieldValues(BaseModel):
    field: str
    total_count: int
    values: list[ValueCount]
