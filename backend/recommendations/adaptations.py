"""Sugerencias de adaptación (sección 13).

Para cada necesidad que quedó en `gap`, proponemos una modificación de
taller. Es un catálogo fijo y determinista a propósito: la adaptación que se
sugiere depende de qué le falta al producto, no de una llamada a OpenAI. La
IA puede mejorar la redacción más adelante, pero nunca decide CUÁL
adaptación corresponde.

`limitation` nunca es opcional ni cadena vacía: el frontend la muestra con
el mismo peso visual que `benefit` (`AdaptationPanel.tsx`).
"""

from dataclasses import dataclass

from schemas.common import AdaptationNeed

from .models import Reason


@dataclass(frozen=True)
class AdaptationSuggestion:
    id: str
    title: str
    description: str
    benefit: str
    limitation: str
    effort: str  # "low" | "medium" | "high"


_CATALOG: dict[AdaptationNeed, AdaptationSuggestion] = {
    "magnetic-closure": AdaptationSuggestion(
        id="adapt-magnetic",
        title="Sustituir la botonadura por cierre magnético",
        description=(
            "Un taller reemplaza los botones por imanes ocultos y deja los "
            "originales cosidos encima, solo como decoración."
        ),
        benefit="La prenda se abrocha con una mano y sin pinza fina.",
        limitation=(
            "Los imanes pueden interferir con marcapasos: hay que "
            "consultarlo antes."
        ),
        effort="medium",
    ),
    "no-fine-motor": AdaptationSuggestion(
        id="adapt-pull-loop",
        title="Añadir argolla de tiro al cierre",
        description=(
            "Se cose una anilla de cinta rígida al deslizador del cierre "
            "para poder tirar con el dedo o con un gancho."
        ),
        benefit="Elimina la necesidad de pinzar el deslizador.",
        limitation="No cambia la fuerza necesaria para subir el cierre.",
        effort="low",
    ),
    "one-handed-dressing": AdaptationSuggestion(
        id="adapt-pull-loop",
        title="Añadir argolla de tiro al cierre",
        description=(
            "Se cose una anilla de cinta rígida al deslizador del cierre "
            "para poder tirar con el dedo o con un gancho."
        ),
        benefit="Permite abrochar la prenda usando una sola mano.",
        limitation="No cambia la fuerza necesaria para subir el cierre.",
        effort="low",
    ),
    "seated-wearing": AdaptationSuggestion(
        id="adapt-side-opening",
        title="Abrir costura lateral con velcro",
        description=(
            "Se abre la costura lateral y se cierra con banda ancha de "
            "velcro, de la cadera al dobladillo."
        ),
        benefit="Permite vestirse sin levantar las caderas.",
        limitation=(
            "Cambia la caída de la prenda y no se puede revertir sin dejar "
            "marca."
        ),
        effort="high",
    ),
    "sensory-friendly": AdaptationSuggestion(
        id="adapt-seams",
        title="Quitar etiquetas y forrar costuras",
        description=(
            "Se retiran las etiquetas cosidas y se cubren las costuras "
            "internas con cinta de algodón plana."
        ),
        benefit="Reduce el roce en la piel en los puntos más comunes.",
        limitation="No elimina las costuras estructurales de las sisas.",
        effort="low",
    ),
    "easy-access-medical": AdaptationSuggestion(
        id="adapt-access-flap",
        title="Añadir solapa de acceso",
        description=(
            "Se abre una ventana discreta con solapa superpuesta en la "
            "zona que se necesite."
        ),
        benefit="Da acceso sin desvestirse por completo.",
        limitation="La solapa se marca bajo tejidos muy finos.",
        effort="medium",
    ),
    "adjustable-fit": AdaptationSuggestion(
        id="adapt-elastic-panel",
        title="Añadir panel elástico lateral",
        description=(
            "Se inserta un panel de tela elástica en el costado para "
            "ganar rango de ajuste sin cambiar el patrón visible."
        ),
        benefit="La prenda se adapta a cambios de volumen durante el día.",
        limitation="No sirve para diferencias de talla muy grandes.",
        effort="medium",
    ),
    "prosthesis-friendly": AdaptationSuggestion(
        id="adapt-wide-opening",
        title="Ensanchar la abertura de manga o pernera",
        description=(
            "Se descose y se vuelve a coser la abertura con más holgura, "
            "para que pase la prótesis sin forzar la tela."
        ),
        benefit="La prenda entra y sale sin enganchar la prótesis.",
        limitation="Puede requerir un refuerzo extra en el dobladillo.",
        effort="medium",
    ),
    "thermoregulation": AdaptationSuggestion(
        id="adapt-vent-panel",
        title="Añadir panel de malla transpirable",
        description=(
            "Se sustituye un panel de la prenda por malla técnica en las "
            "zonas de mayor sudoración."
        ),
        benefit="Mejora la regulación de temperatura sin cambiar el corte.",
        limitation="La malla es menos resistente que el tejido original.",
        effort="low",
    ),
}

MAX_SUGGESTIONS = 3


def build_adaptations(reasons: list[Reason]) -> list[AdaptationSuggestion]:
    """Para cada `gap` de las razones, busca su adaptación en el catálogo.
    Sin duplicados (dos necesidades pueden compartir la misma sugerencia),
    tope de MAX_SUGGESTIONS para no abrumar la pantalla de detalle."""
    suggestions: list[AdaptationSuggestion] = []
    seen_ids: set[str] = set()

    for reason in reasons:
        if reason.status != "gap":
            continue
        suggestion = _CATALOG.get(reason.need)
        if suggestion is None or suggestion.id in seen_ids:
            continue
        seen_ids.add(suggestion.id)
        suggestions.append(suggestion)
        if len(suggestions) >= MAX_SUGGESTIONS:
            break

    return suggestions
