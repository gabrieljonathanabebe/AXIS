from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from pydantic.json_schema import SkipJsonSchema


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


# ===== ACTIONS ===============================================================
# Tool schema for AI Commands; mirrors CevynAction and actionShapes in the
# frontend, which stays the final structural check.
class ChartType(StrEnum):
    BAR = "bar"
    DONUT = "donut"
    LINE = "line"
    PIE = "pie"
    SCATTER = "scatter"


Aggregation = GroupAggregation | Literal["none"]


class ActionModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, extra="forbid")


class ChartEncoding(ActionModel):
    color: str | SkipJsonSchema[None] = None
    series: str | SkipJsonSchema[None] = None
    size: str | SkipJsonSchema[None] = None
    x: str | SkipJsonSchema[None] = None
    y: str | SkipJsonSchema[None] = None


class CreateChartAction(ActionModel):
    """Create a new chart. Fields are addressed by name."""

    type: Literal["chart/create"]
    aggregation: Aggregation | SkipJsonSchema[None] = None
    chart_type: ChartType
    encoding: ChartEncoding | SkipJsonSchema[None] = None


class RemoveChartAction(ActionModel):
    """Remove an existing chart."""

    type: Literal["chart/remove"]
    chart_id: str


class SetChartTitleAction(ActionModel):
    """Set and show the title of an existing chart."""

    type: Literal["chart/setTitle"]
    chart_id: str
    title: str


class SetChartTypeAction(ActionModel):
    """Change the type of an existing chart; resets encoding and
    aggregation to the defaults of the new type."""

    type: Literal["chart/setType"]
    chart_id: str
    chart_type: ChartType


class UpdateChartAggregationAction(ActionModel):
    """Change the aggregation of an existing chart."""

    type: Literal["chart/updateAggregation"]
    aggregation: Aggregation
    chart_id: str


class UpdateChartEncodingAction(ActionModel):
    """Change the encoding of an existing chart. Fields are addressed by
    name."""

    type: Literal["chart/updateEncoding"]
    chart_id: str
    encoding: ChartEncoding


CevynAction = (
    CreateChartAction
    | RemoveChartAction
    | SetChartTitleAction
    | SetChartTypeAction
    | UpdateChartAggregationAction
    | UpdateChartEncodingAction
)


class CevynActionBatch(ActionModel):
    actions: list[CevynAction]


# ===== AI COMMANDS ===========================================================
class AiChartContext(BaseModel):
    aggregation: Aggregation
    encoding: ChartEncoding
    id: str
    title: str | None = None
    type: ChartType


class AiCommandResult(BaseModel):
    actions: list[Any] | None
    message: str | None


class AiEncodingRule(BaseModel):
    key: str
    recommended_roles: list[SemanticRole]
    required: bool
    supported_roles: list[SemanticRole]


class AiChartRule(BaseModel):
    encodings: list[AiEncodingRule]
    supported_aggregations: list[Aggregation]
    type: ChartType


class AiCommandRequest(BaseModel):
    chart_rules: list[AiChartRule]
    charts: list[AiChartContext]
    fields: list[Field]
    prompt: str
