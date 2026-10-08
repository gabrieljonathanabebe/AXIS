from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from pydantic.json_schema import SkipJsonSchema

from app.datasets.models import Field, SemanticRole
from app.queries.models import GroupAggregation


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
# Request and result of the ai-commands route; not part of the tool schema.
class AiChartContext(BaseModel):
    """A chart on the canvas as Claude sees it, addressed by its id."""

    aggregation: Aggregation
    encoding: ChartEncoding
    id: str
    title: str | None = None
    type: ChartType


class AiEncodingRule(BaseModel):
    """Required flag and recommended and allowed roles of one encoding."""

    key: str
    recommended_roles: list[SemanticRole]
    required: bool
    supported_roles: list[SemanticRole]


class AiChartRule(BaseModel):
    """Aggregations and encoding rules of one chart type, from the frontend."""

    encodings: list[AiEncodingRule]
    supported_aggregations: list[Aggregation]
    type: ChartType


class AiCommandRequest(BaseModel):
    """Prompt with the current charts, fields and chart rules."""

    chart_rules: list[AiChartRule]
    charts: list[AiChartContext]
    fields: list[Field]
    prompt: str


class AiCommandResult(BaseModel):
    """Proposed actions, validated by the frontend, and a status message."""

    actions: list[Any] | None
    message: str | None
