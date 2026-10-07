from anthropic import AnthropicError
from fastapi import APIRouter, HTTPException

from app.ai import ai_commands
from app.datasets.dependencies import StoredDatasetDep
from app.ai.models import AiCommandRequest, AiCommandResult

router = APIRouter(prefix="/datasets/{dataset_id}", tags=["ai"])


@router.post("/ai-commands")
def create_ai_command(
    stored: StoredDatasetDep,
    request: AiCommandRequest,
) -> AiCommandResult:
    """Turn a natural-language prompt into Cevyn actions via Claude."""
    try:
        return ai_commands.run_ai_command(stored.profile, request)
    except AnthropicError as error:
        raise HTTPException(
            status_code=502,
            detail=f"AI request failed: {error}",
        ) from error
