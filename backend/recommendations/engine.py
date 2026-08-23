"""Motor de compatibilidad — LO ESCRIBE ISAAC.

Slater dejó la firma y las pruebas para que el frontend y el backend sepan
qué esperar. Las reglas y los pesos son tu decisión, y son el corazón del
proyecto.

LA REGLA QUE NO SE ROMPE
------------------------
Este módulo puntúa. OpenAI explica. OpenAI nunca puntúa.

`score(perfil, productos)` tiene que ser una función pura: mismos argumentos,
mismo resultado, siempre. Sin `random`, sin `datetime.now()`, sin llamadas de
red. Si el mismo perfil diera números distintos en cada demo, no podríamos
defender el número ante el jurado.
"""

from .models import ProductInput, ProfileInput, Reason, Scored


def score_products(
    profile: ProfileInput,
    products: list[ProductInput],
) -> list[Scored]:
    """Puntúa cada producto contra el perfil y devuelve la lista ORDENADA
    por score descendente.

    TODO (Isaac): implementar. Lo que hay abajo es un marcador de posición
    que solo cuenta necesidades coincidentes, para que las pruebas y la API
    tengan algo con qué correr. Reemplazalo entero.

    Cosas que las reglas deberían considerar y esto no hace:

    - El tipo de cierre contra la destreza real. `buttons` + `limited-grip`
      debería hundir el score, no restarle un poco.
    - La postura. Si la persona se viste sentada, una prenda que entra por
      la cabeza es peor que una cruzada.
    - Que el catálogo NO es solo ropa. En una prótesis o una silla de ruedas,
      `closure_type` no significa nada. Decidí qué hacés con las categorías
      `prosthetics`, `orthotics`, `mobility` y `daily-living`, y dejalo
      escrito acá.
    """
    results: list[Scored] = []

    for product in products:
        reasons: list[Reason] = []
        score = 0

        for need in profile.needs:
            covered = need in product.adaptation_needs
            reasons.append(
                Reason(
                    need=need,
                    status="match" if covered else "gap",
                    weight=20 if covered else 0,
                    # Los `gap` también se devuelven: el frontend los pinta
                    # igual que los `match`. No escondemos lo que no resuelve.
                    label=need if covered else f"No cubre: {need}",
                )
            )
            if covered:
                score += 20

        results.append(
            Scored(
                product_id=product.id,
                score=max(0, min(100, score)),
                reasons=reasons,
            )
        )

    results.sort(key=lambda item: item.score, reverse=True)
    return results
