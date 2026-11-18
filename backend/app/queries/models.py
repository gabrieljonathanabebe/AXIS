from datetime import date
from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel, Field

from app.datasets.models import TimeGrain, ValueCount


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


class DateRangeFilter(BaseModel):
    """Keep rows whose date lies in the range, bounds included; None is open."""

    kind: Literal["date_range"]
    field: str
    start: date | None = None
    end: date | None = None


ChartFilter = ValuesChartFilter | RangeChartFilter | DateRangeFilter
TableFilter = ChartFilter


# ===== CHART QUERY ===========================================================
class ChartSort(BaseModel):
    """Order of the categories: by their total value or by their name."""

    by: Literal["value", "category"]
    order: Literal["asc", "desc"]


class ChartLimit(BaseModel):
    """Keep the categories with the largest or smallest total value."""

    kind: Literal["top", "bottom"]
    count: int = Field(ge=1)


class ChartQueryRequest(BaseModel):
    """Encoding, aggregations, filters and order of an aggregated chart."""

    x: str
    y: str
    series: str | None = None
    color: str | None = None
    color_aggregation: GroupAggregation | None = None
    aggregation: GroupAggregation
    filters: list[ChartFilter] = []
    time_grain: TimeGrain | None = None
    sort: ChartSort | None = None
    limit: ChartLimit | None = None
    categories: list[str | None] | None = None


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


# ===== CARD QUERY ============================================================
class CardQueryRequest(BaseModel):
    """Field, aggregation and filters of a card; no field counts rows."""

    field: str | None = None
    aggregation: GroupAggregation
    filters: list[ChartFilter] = []


class CardQueryResult(BaseModel):
    """Aggregated value of a card; None if no row has a value."""

    value: float | None


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
