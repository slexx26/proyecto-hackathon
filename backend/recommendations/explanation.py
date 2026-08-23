"""Explicación en lenguaje natural (secciones 11 y 12).

INVARIANTE: esta función recibe `score` y `reasons` YA CALCULADOS por el
motor. Los lee, no los toca. No hay ningún camino en este archivo que pueda
cambiar un número.

Hay dos modos:

- Sin `OPENAI_API_KEY` (o si la llamada falla): plantilla determinista.
  Funciona siempre, no depende de red ni de una clave, y es lo que corre en
  la demo si OpenAI está caído.
- Con `OPENAI_API_KEY`: se le pide a OpenAI que redacte la misma evidencia
  con más naturalidad, sin inventar nada que no esté en `reasons`.

Si OpenAI falla o tarda, `explain()` devuelve la plantilla. El router de
recomendaciones tiene que tratar `explanation=None` como un resultado
válido, no un error (sección 24): mejor sin explicación bonita que un 500
en medio de la demo.
"""

from .labels import NEED_LABELS
from .models import Reason

_TIMEOUT_SECONDS = 6.0


def _plantilla(product_name: str, score: int, reasons: list[Reason]) -> str:
    matches = [r for r in reasons if r.status == "match"]
    partials = [r for r in reasons if r.status == "partial"]
    gaps = [r for r in reasons if r.status == "gap"]
    covered = matches + partials

    if not covered:
        return (
            f"{product_name} no cubre de fábrica ninguna de las necesidades "
            "que marcaste. Aparece porque puede adaptarse, no porque "
            "encaje tal cual."
        )

    detalle = ", ".join(NEED_LABELS.get(r.need, r.need) for r in covered)
    cuenta_total = len(reasons)
    cuenta_cubiertas = len(covered)

    cabeza = (
        f"{product_name} obtiene {score} de 100 porque cubre "
        f"{cuenta_cubiertas} de las {cuenta_total} necesidades de tu "
        f"perfil: {detalle}."
    )

    if gaps:
        plural = "puntos" if len(gaps) != 1 else "punto"
        cola = (
            f" Queda pendiente {len(gaps)} {plural}, que sí podés resolver "
            "con las adaptaciones de abajo."
        )
    else:
        cola = " No quedan necesidades sin cubrir."

    return cabeza + cola


def _via_openai(
    product_name: str,
    score: int,
    reasons: list[Reason],
    api_key: str,
) -> str | None:
    """Redacta la misma evidencia con OpenAI. Nunca decide el score: se lo
    pasamos ya calculado y le pedimos que lo respete tal cual."""
    try:
        from openai import OpenAI
    except ImportError:
        return None

    evidencia = "\n".join(
        f"- {NEED_LABELS.get(r.need, r.need)}: {r.status}" for r in reasons
    )
    prompt = (
        "Redactá en español, en 2-3 frases, por qué esta prenda obtuvo "
        f"{score} de 100 de compatibilidad. Usá SOLO esta evidencia, sin "
        "inventar características ni cambiar el número. Mencioná también "
        "lo que no cubre, si hay algo. Sin lenguaje médico, sin "
        "diagnosticar a la persona.\n\n"
        f"Producto: {product_name}\n"
        f"Score (fijo, no lo repitas como si lo calcularas vos): {score}\n"
        f"Evidencia:\n{evidencia}"
    )

    try:
        client = OpenAI(api_key=api_key, timeout=_TIMEOUT_SECONDS)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            timeout=_TIMEOUT_SECONDS,
        )
        text = response.choices[0].message.content
        return text.strip() if text else None
    except Exception:
        # Cualquier falla de red, timeout o cuota: caemos a la plantilla.
        # No propagamos el error, sección 24.
        return None


def explain(
    product_name: str,
    score: int,
    reasons: list[Reason],
    openai_api_key: str = "",
) -> str:
    """Explicación siempre disponible. Con clave, intenta OpenAI primero;
    sin clave, o si falla, usa la plantilla determinista."""
    if openai_api_key:
        result = _via_openai(product_name, score, reasons, openai_api_key)
        if result:
            return result

    return _plantilla(product_name, score, reasons)
