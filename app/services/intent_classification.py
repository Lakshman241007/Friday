import json
from typing import TypedDict

import httpx
from langgraph.graph import END, StateGraph
from pydantic import ValidationError

from app.core.config import get_settings
from app.models.schemas import CallAgentOutput
from app.services.retry import TransientError, retry_on_transient
from app.services.system_prompts import INTENT_CLASSIFICATION_SYSTEM_PROMPT

SARVAM_CHAT_URL = "https://api.sarvam.ai/v1/chat/completions"

# Same policy as the STT client: retry throttling/5xx, never retry a 4xx.
RETRYABLE_STATUS_CODES = frozenset({408, 429, 500, 502, 503, 504})


class IntentClassificationError(Exception):
    pass


class IntentState(TypedDict):
    transcript: str
    output: CallAgentOutput | None


def _post_to_sarvam_chat(transcript: str) -> str:
    settings = get_settings()
    payload = {
        "model": settings.sarvam_chat_model,
        "messages": [
            {"role": "system", "content": INTENT_CLASSIFICATION_SYSTEM_PROMPT},
            {"role": "user", "content": transcript},
        ],
        "temperature": 0,
    }
    headers = {
        "Authorization": f"Bearer {settings.sarvam_api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = httpx.post(SARVAM_CHAT_URL, headers=headers, json=payload, timeout=60.0)
    except httpx.HTTPError as exc:
        raise TransientError(f"Sarvam chat request failed: {exc}") from exc

    if response.status_code in RETRYABLE_STATUS_CODES:
        raise TransientError(
            f"Sarvam chat returned {response.status_code}: {response.text}"
        )
    if response.status_code != 200:
        raise IntentClassificationError(
            f"Sarvam chat failed ({response.status_code}): {response.text}"
        )

    body = response.json()
    try:
        return body["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as exc:
        raise IntentClassificationError(f"Unexpected Sarvam chat response: {body}") from exc


def _call_sarvam_chat(transcript: str) -> str:
    """Ask sarvam-105b to classify the transcript, retrying transient failures."""
    settings = get_settings()
    if not settings.sarvam_api_key:
        raise IntentClassificationError("SARVAM_API_KEY is not configured")

    try:
        return retry_on_transient(
            lambda: _post_to_sarvam_chat(transcript),
            description="Sarvam chat",
            attempts=settings.sarvam_retry_attempts,
            base_delay_seconds=settings.sarvam_retry_base_delay_seconds,
        )
    except RuntimeError as exc:
        raise IntentClassificationError(str(exc)) from exc


def _parse_output(content: str) -> CallAgentOutput:
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError as exc:
        raise IntentClassificationError(f"Model did not return valid JSON: {content}") from exc

    try:
        return CallAgentOutput.model_validate(parsed)
    except ValidationError as exc:
        raise IntentClassificationError(
            f"Model output failed contract validation: {exc}"
        ) from exc


def _classify_intent_node(state: IntentState) -> IntentState:
    content = _call_sarvam_chat(state["transcript"])
    return {"transcript": state["transcript"], "output": _parse_output(content)}


def _build_graph():
    graph = StateGraph(IntentState)
    graph.add_node("classify_intent", _classify_intent_node)
    graph.set_entry_point("classify_intent")
    graph.add_edge("classify_intent", END)
    return graph.compile()


_graph = _build_graph()


def classify_intent(transcript: str) -> CallAgentOutput:
    """The LangGraph intent-classification node: transcript -> validated OP JSON.

    Runs the transcript through the system prompt on sarvam-105b and
    structurally enforces the 3-parameter output contract via
    CallAgentOutput (extra="forbid").
    """
    result = _graph.invoke({"transcript": transcript, "output": None})
    output = result["output"]
    if output is None:
        raise IntentClassificationError("Intent classification graph produced no output")
    return output
