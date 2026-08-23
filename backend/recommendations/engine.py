"""Motor de compatibilidad.

LA REGLA QUE NO SE ROMPE
------------------------
Este módulo puntúa. OpenAI explica. OpenAI nunca puntúa.

`score_products(perfil, productos)` es una función pura: mismos argumentos,
mismo resultado, siempre. Sin `random`, sin `datetime.now()`, sin llamadas de
red. Si el mismo perfil diera números distintos en cada demo, no podríamos
defender el número ante el jurado.

CÓMO SE ARMA EL SCORE
----------------------
1. Base fija de 15 puntos: ningún producto del catálogo parte de cero.
2. Hasta 70 puntos repartidos entre las necesidades marcadas en el perfil.
   Cada necesidad reparte el mismo peso. Si el producto la cubre de fábrica,
   suma el peso completo (`match`). Si no la cubre pero el tipo de cierre la
   resuelve igual — solo aplica a `one-handed-dressing` y `no-fine-motor`,
   que son sobre destreza de manos — suma la mitad (`partial`). Si no la
   cubre de ninguna forma, suma cero (`gap`).
3. Hasta ±18 de contexto que NO genera una razón nueva (evita duplicar la
   razón que ya existe por esa necesidad): compatibilidad del cierre con la
   destreza, si la postura de vestirse encaja, si la sensibilidad encaja, y
   si la categoría es una de las preferidas.

El catálogo NO es solo ropa. Para `prosthetics`, `orthotics`, `mobility` y
`daily-living`, el tipo de cierre no significa nada — una prótesis no se
"abrocha" — así que esas categorías se saltan el bono/penalización de cierre
y de postura, y dependen solo de qué necesidades marca el perfil.
"""

from .labels import NEED_LABELS
from .models import ProductInput, ProfileInput, Reason, Scored

BASE_SCORE = 15
NEEDS_BUDGET = 70
PARTIAL_FACTOR = 0.5

CLOSURE_BONUS = 10
CLOSURE_PENALTY = -14
POSTURE_BONUS = 8
POSTURE_PENALTY = -5
SENSORY_BONUS = 10
SENSORY_PENALTY = -5
PREFERRED_CATEGORY_BONUS = 5
NON_PREFERRED_CATEGORY_PENALTY = -12

# Solo estas dos necesidades tienen equivalente en el tipo de cierre: ambas
# son, en el fondo, "esto se puede abrochar sin pinza fina ni las dos manos".
CLOSURE_EQUIVALENT_NEEDS = {"one-handed-dressing", "no-fine-motor"}

# Cierres que no exigen dos manos ni fuerza de agarre fina.
LOW_DEXTERITY_CLOSURES = {"magnetic", "velcro", "elastic", "none"}
# Con una sola mano alcanza, aunque haga falta algo más de destreza.
ONE_HAND_CLOSURES = LOW_DEXTERITY_CLOSURES | {"zipper-loop"}

NON_CLOTHING_CATEGORIES = {"prosthetics", "orthotics", "mobility", "daily-living"}


def _closure_compatible(closure_type: str, hand_dexterity: str) -> bool:
    if hand_dexterity == "both-hands":
        return True
    if hand_dexterity == "one-hand":
        return closure_type in ONE_HAND_CLOSURES
    if hand_dexterity == "limited-grip":
        return closure_type in LOW_DEXTERITY_CLOSURES
    return True


def _need_label(need: str, covered: bool) -> str:
    text = NEED_LABELS.get(need, need)
    if covered:
        return text[0].upper() + text[1:]
    return f"No cubierto: {text}"


def _score_reasons(
    profile: ProfileInput,
    product: ProductInput,
) -> tuple[list[Reason], int]:
    """Reparte NEEDS_BUDGET entre las necesidades del perfil. Devuelve las
    razones (una por necesidad, sin duplicar) y los puntos que sumaron."""
    if not profile.needs:
        return [], 0

    per_need = NEEDS_BUDGET / len(profile.needs)
    reasons: list[Reason] = []
    points = 0.0
    seen: set[str] = set()

    for need in profile.needs:
        if need in seen:
            continue
        seen.add(need)

        covered = need in product.adaptation_needs
        closure_helps = (
            not covered
            and need in CLOSURE_EQUIVALENT_NEEDS
            and product.category not in NON_CLOTHING_CATEGORIES
            and _closure_compatible(product.closure_type, profile.hand_dexterity)
            and profile.hand_dexterity != "both-hands"
        )

        if covered:
            status, weight = "match", round(per_need)
        elif closure_helps:
            status, weight = "partial", round(per_need * PARTIAL_FACTOR)
        else:
            status, weight = "gap", 0

        points += weight
        reasons.append(
            Reason(
                need=need,
                status=status,
                weight=weight,
                label=_need_label(need, covered or closure_helps),
            )
        )

    return reasons, round(points)


def _context_bonus(profile: ProfileInput, product: ProductInput) -> int:
    """Ajustes que no generan una razón propia: refuerzan o descuentan sin
    duplicar la evidencia que ya aparece por necesidad."""
    bonus = 0
    is_clothing = product.category not in NON_CLOTHING_CATEGORIES

    if is_clothing:
        compatible = _closure_compatible(product.closure_type, profile.hand_dexterity)
        if profile.hand_dexterity != "both-hands":
            bonus += CLOSURE_BONUS if compatible else CLOSURE_PENALTY
        else:
            bonus += CLOSURE_BONUS

        if profile.dressing_posture != "standing":
            if "seated-wearing" in product.adaptation_needs:
                bonus += POSTURE_BONUS
            else:
                bonus += POSTURE_PENALTY

        if profile.sensory_sensitivity == "high":
            if "sensory-friendly" in product.adaptation_needs:
                bonus += SENSORY_BONUS
            else:
                bonus += SENSORY_PENALTY

    if profile.preferred_categories:
        if product.category in profile.preferred_categories:
            bonus += PREFERRED_CATEGORY_BONUS
        else:
            bonus += NON_PREFERRED_CATEGORY_PENALTY

    return bonus


def score_products(
    profile: ProfileInput,
    products: list[ProductInput],
) -> list[Scored]:
    """Puntúa cada producto contra el perfil y devuelve la lista ORDENADA
    por score descendente. Empate: se conserva el orden de entrada
    (`sort` es estable), para que el resultado sea 100% reproducible."""
    results: list[Scored] = []

    for product in products:
        reasons, need_points = _score_reasons(profile, product)
        raw_score = BASE_SCORE + need_points + _context_bonus(profile, product)

        results.append(
            Scored(
                product_id=product.id,
                score=max(0, min(100, round(raw_score))),
                reasons=reasons,
            )
        )

    results.sort(key=lambda item: item.score, reverse=True)
    return results
