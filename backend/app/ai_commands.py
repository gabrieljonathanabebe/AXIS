import json
import logging
import os


from anthropic import Anthropic
from anthropic.types.beta import BetaMessage

from app.models import (
    AiCommandRequest,
    AiCommandResult,
    CevynActionBatch,
    SemanticRole,
)

# ===== CONSTANTS =============================================================
MODEL = "claude-sonnet-5-5"
TOOL_NAME = "run_cevyn_actions"
logger = logging.getLogger("uvicorn.error")

SYSTEM_PROMPT = """\
You are the chart assistant of Cevyn, a visual analytics app.
Turn the user's request into Cevyn actions and call the run_cevyn_actions
tool once with all of them.
Use only field names from <fields> and chart ids from <charts>. A chart
created in this call cannot be addressed by later actions in the same call.
If the request cannot be expressed with these actions and fields, do not
call the tool; explain briefly why instead.
Any text you write is shown in a small status line: use plain text without
Markdown, at most two short sentences, in the language of the request.
Each request is independent and you cannot see earlier messages, so do not
ask follow-up questions; instead, suggest one prompt the user could send.
"""


TOOL = {
    "description": "Run Cevyn actions on the chart workspace. All actions "
    "are applied together as one undo step.",
    "input_schema": CevynActionBatch.model_json_schema(),
    "name": TOOL_NAME,
    "strict": True,
}


# ===== HELPERS ===============================================================
def build_user_message(request: AiCommandRequest) -> str:
    fields = [field.model_dump(mode="json") for field in request.fields]
    charts = [
        chart.model_dump(mode="json", exclude_none=True)
        for chart in request.charts
    ]
    return (
        f"<fields>\n{json.dumps(fields)}\n</fields>\n"
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
def run_ai_command(request: AiCommandRequest) -> AiCommandResult:
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
        system=SYSTEM_PROMPT,
        tool_choice={"type": "auto", "disable_parallel_tool_use": True},  # type: ignore
        tools=[TOOL],  # type: ignore
    )
    result = read_result(response)
    logger.info("AI command %r -> %s", request.prompt, result.actions)
    return result
