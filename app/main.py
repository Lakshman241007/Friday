from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.agents import router as agents_router
from app.api.routes.calls import router as calls_router
from app.api.routes.reports import router as reports_router
from app.core.config import get_settings

app = FastAPI(title="Friday Call Agent Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calls_router)
app.include_router(reports_router)
app.include_router(agents_router)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}
