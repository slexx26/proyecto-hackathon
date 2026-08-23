"""Vocabularios cerrados compartidos.

Espejo de `frontend/src/types/`. Si cambia un valor acá, cambia allá en el
mismo PR: son el mismo contrato escrito dos veces.
"""

from typing import Literal

AdaptationNeed = Literal[
    "one-handed-dressing",
    "seated-wearing",
    "magnetic-closure",
    "no-fine-motor",
    "sensory-friendly",
    "easy-access-medical",
    "prosthesis-friendly",
    "adjustable-fit",
    "thermoregulation",
]

ProductCategory = Literal[
    "tops",
    "bottoms",
    "outerwear",
    "footwear",
    "underwear",
    "accessories",
    "prosthetics",
    "orthotics",
    "mobility",
    "daily-living",
]

ClosureType = Literal[
    "magnetic",
    "velcro",
    "zipper-loop",
    "zipper",
    "buttons",
    "elastic",
    "none",
]

ProviderKind = Literal[
    "adaptive-apparel",
    "adaptation-workshop",
    "prosthetics",
    "mobility-aids",
    "daily-living-aids",
]

ProviderPlan = Literal["free", "verified", "featured"]
