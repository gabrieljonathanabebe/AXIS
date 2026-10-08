from datetime import date
from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel

from app.datasets.models import ValueCount


# ===== AGGREGATION ===========================================================
class GroupAggregation(StrEnum):
    """How the values of one chart group are combined."""

    SUM = "sum"
    MEAN = "mean"
    MEDIAN = "median"
    MIN = "min"
    MAX = "max"
    COUNT = "count"


# ===== FILTERS ===============================================================
class ValuesChartFilter(BaseModel):
    """Keep rows whose field, as text, is one of the values."""

    kind: Literal["values"]
    field: str
    values: list[str]


class RangeChartFilter(BaseModel):
    """Keep rows whose numeric field lies in the range; None is open."""

    kind: Literal["range"]
    field: str
    min: float | None = None
    max: float | None = None


ChartFilter = ValuesChartFilter | RangeChartFilter


class DateRangeTableFilter(BaseModel):
    """Keep rows whose date lies in the range; table only, None is open."""

    kind: Literal["date_range"]
    field: str
    start: date | None = None
    end: date | None = None


TableFilter = ChartFilter | DateRangeTableFilter


# ===== CHART QUERY ===========================================================
class ChartQueryRequest(BaseModel):
    """Encoding, aggregations and filters of a bar, line, pie or donut."""

    x: str
    y: str
    series: str | None = None
    color: str | None = None
    color_aggregation: GroupAggregation | None = None
    aggregation: GroupAggregation
    filters: list[ChartFilter] = []


class ChartQueryPoint(BaseModel):
    """One aggregated group; X and series are sent as text."""

    x: str | None
    series: str | None
    value: float | None
    color_value: float | None = None


class ChartQueryResult(BaseModel):
    """All groups of an aggregated chart."""

    points: list[ChartQueryPoint]


# ===== POINTS QUERY ==========================================================
class PointsQueryRequest(BaseModel):
    """Fields a scatter chart encodes."""

    fields: list[str]


class PointsQueryResult(BaseModel):
    """Single rows for a scatter chart and the dataset row count."""

    rows: list[dict[str, Any]]
    total_count: int


# ===== TABLE QUERY ===========================================================
class TableSort(BaseModel):
    """Sort field and direction of the table."""

    direction: Literal["asc", "desc"]
    field: str


class TableQueryRequest(BaseModel):
    """Filters, sort and page of the table."""

    filters: list[TableFilter] = []
    limit: int = 100
    offset: int = 0
    sort: TableSort | None = None


class TableQueryResult(BaseModel):
    """One page of table rows and the row count after filtering."""

    offset: int
    rows: list[dict[str, Any]]
    total_count: int


# ===== FIELD VALUES ==========================================================
class FieldValues(BaseModel):
    """Most frequent values of a field for the table's values filter."""

    field: str
    total_count: int
    values: list[ValueCount]
