"""Etiquetas en español de cada necesidad.

Espejo de `frontend/src/utils/labels.ts` (`needLabels`). Si cambia una acá,
cambia allá: son la misma voz en dos lados del contrato.
"""

from schemas.common import AdaptationNeed

NEED_LABELS: dict[AdaptationNeed, str] = {
    "one-handed-dressing": "vestirse con una mano",
    "seated-wearing": "vestirse sentada o sentado",
    "magnetic-closure": "cierre magnético",
    "no-fine-motor": "sin pinza fina",
    "sensory-friendly": "amable con la sensibilidad",
    "easy-access-medical": "acceso para cuidados médicos",
    "prosthesis-friendly": "compatible con prótesis",
    "adjustable-fit": "ajuste regulable",
    "thermoregulation": "regula la temperatura",
}
