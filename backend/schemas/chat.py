"""Chatbot de apoyo (sección 17). No sustituye al motor determinista."""

from typing import Literal

from .provider import CamelModel


class ChatMessage(CamelModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    # ISO 8601.
    created_at: str
    # Opcionales, siempre juntos. Si el asistente identifica una prenda
    # concreta, el frontend muestra un botón directo a su detalle y a
    # "dónde conseguirla" (ver docs/api-contract.md, sección /chat).
    product_id: str | None = None
    product_name: str | None = None


class ChatRequest(CamelModel):
    message: str
    history: list[ChatMessage] = []
    product_id: str | None = None


class ChatResponse(CamelModel):
    reply: ChatMessage
