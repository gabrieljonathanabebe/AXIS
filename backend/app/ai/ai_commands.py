import json
import logging
import os
from typing import Any

from anthropic import Anthropic
from anthropic.types.beta import BetaMessage

from app.ai import ai_context
from app.ai.models import AiCommandRequest, AiCommandResult, CevynActionBatch
from app.datasets.models import DatasetProfile, SemanticRole

# ===== CONSTANTS =============================================================
MODEL = "claude-sonnet-5-5"
TOOL_NAME = "run_cevyn_actions"
logger = logging.getLogger("uvicorn.error")

SYSTEM_PROMPT = """\
You are the chart assistant of Cevyn, a visual analytics app.
Turn the user's request into Cevyn actions and call the run_cevyn_actions
tool once with all of them.
Use only field names from <dataset> and chart ids from <charts>. A chart
created in this call cannot be addressed by later actions in the same call.
<chart_rules> lists the aggregations of each chart type and, per encoding,
the recommended roles followed by the roles it also allows. Assign a field
only to an encoding that allows its role, preferring recommended roles.
Each <dataset> line reads: name | physical type | semantic role | values.
Use the values to build readable charts, for example no color or series
field with a single distinct value.
If the request cannot be expressed with these actions and fields, do not
call the tool; explain briefly why instead.
Any text you write is shown in a small status line: use plain text without
Markdown, at most two short sentences, in the language of the request.
Each request is independent and you cannot see earlier messages, so do not
ask follow-up questions; instead, suggest one prompt the user could send.
"""


def build_input_schema(request: AiCommandRequest) -> dict[str, Any]:
    schema = CevynActionBatch.model_json_schema()
    field_names = [field.name for field in request.fields]
    if field_names:
        for encoding in schema["$defs"]["ChartEncoding"]["properties"].values():
            encoding["enum"] = field_names
    return schema


def build_tool(request: AiCommandRequest) -> dict[str, Any]:
    return {
        "description": "Run Cevyn actions on the chart workspace. All "
        "actions are applied together as one undo step.",
        "input_schema": build_input_schema(request),
        "name": TOOL_NAME,
        "strict": False,
    }


# ===== HELPERS ===============================================================
def build_system(
    profile: DatasetProfile, request: AiCommandRequest
) -> list[dict[str, Any]]:
    chart_rules = ai_context.build_chart_rules_context(request.chart_rules)
    dataset = ai_context.build_dataset_context(profile, request.fields)
    context = (
        f"<chart_rules>\n{chart_rules}\n</chart_rules>\n"
        f"<dataset>\n{dataset}\n</dataset>"
    )
    return [
        {"text": SYSTEM_PROMPT, "type": "text"},
        {
            "cache_control": {"type": "ephemeral"},
            "text": context,
            "type": "text",
        },
    ]


def build_user_message(request: AiCommandRequest) -> str:
    charts = [
        chart.model_dump(mode="json", exclude_none=True)
        for chart in request.charts
    ]
    return (
        f"<charts>\n{json.dumps(charts)}\n</charts>\n"
        f"<request>\n{request.prompt}\n</request>"
    )


def read_result(response: BetaMessage) -> AiCommandResult:
    if response.stop_reason in ("max_tokens", "refusal"):
        return AiCommandResult(
            actions=None,
            message=f"The AI stopped early ({response.stop_reason}).",
        )
    texts = [block.text for block in response.content if block.type == "text"]
    tool_use = next(
        (
            block
            for block in response.content
            if block.type == "tool_use" and block.name == TOOL_NAME
        ),
        None,
    )
    return AiCommandResult(
        actions=tool_use.input["actions"] if tool_use else None,  # type: ignore
        message="\n".join(texts) or None,
    )


def find_field_name(
    request: AiCommandRequest, role: SemanticRole
) -> str | None:
    return next(
        (field.name for field in request.fields if field.semantic_role == role),
        None,
    )


def create_stub_result(request: AiCommandRequest) -> AiCommandResult:
    dimension = find_field_name(request, SemanticRole.DIMENSION)
    measure = find_field_name(request, SemanticRole.MEASURE)
    if dimension is None or measure is None:
        return AiCommandResult(
            actions=None,
            message="Stub: dataset needs a dimension and a measure.",
        )
    return AiCommandResult(
        actions=[
            {
                "aggregation": "sum",
                "chartType": "bar",
                "encoding": {"x": dimension, "y": measure},
                "type": "chart/create",
            }
        ],
        message="Stub response without AI.",
    )


# ===== FUNCTION ==============================================================
def run_ai_command(
    profile: DatasetProfile, request: AiCommandRequest
) -> AiCommandResult:
    if os.getenv("CEVYN_AI_STUB") == "1":
        return create_stub_result(request)
    client = Anthropic()
    response = client.beta.messages.create(
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        max_tokens=16000,
        messages=[{"role": "user", "content": build_user_message(request)}],
        model=MODEL,
        output_config={"effort": "medium"},
        system=build_system(profile, request),  # type: ignore
        tool_choice={"type": "auto", "disable_parallel_tool_use": True},  # type: ignore
        tools=[build_tool(request)],  # type: ignore
    )
    result = read_result(response)
    logger.info(
        "AI command %r -> %s (cache read %s, write %s)",
        request.prompt,
        result.actions,
        response.usage.cache_read_input_tokens,
        response.usage.cache_creation_input_tokens,
    )
    return result
