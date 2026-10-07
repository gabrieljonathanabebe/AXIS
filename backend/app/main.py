from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.ai.router import router as ai_router
from app.datasets import store
from app.datasets.router import router as datasets_router
from app.queries.router import router as queries_router

# ===== ENV ===================================================================
load_dotenv()


# ===== APP ===================================================================
@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Load the demo dataset when the server starts."""
    store.register_demo_dataset()
    yield


app = FastAPI(title="CEVYN API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)
app.include_router(datasets_router)
app.include_router(queries_router)


@app.exception_handler(ValueError)
def handle_value_error(_: Request, error: ValueError) -> JSONResponse:
    """Answer a ValueError from query validation with 422 and its message."""
    return JSONResponse(status_code=422, content={"detail": str(error)})


@app.get("/health")
def health_check() -> dict[str, str]:
    """Report that the server is running."""
    return {"status": "ok"}
