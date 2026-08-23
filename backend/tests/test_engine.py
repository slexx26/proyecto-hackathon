"""Pruebas del motor. Las primeras cuatro son el CONTRATO: tienen que seguir
pasando pase lo que pase con las reglas. Fijan las propiedades que el
producto promete, no una implementación concreta.
"""

from recommendations.engine import score_products
from recommendations.models import ProductInput, ProfileInput

CAMISA_MAGNETICA = ProductInput(
    id="adp-001",
    category="tops",
    closure_type="magnetic",
    adaptation_needs=("one-handed-dressing", "magnetic-closure", "no-fine-motor"),
)

CAMISA_CLASICA = ProductInput(
    id="adp-006",
    category="tops",
    closure_type="buttons",
    adaptation_needs=(),
)

PANTALON_LATERAL = ProductInput(
    id="adp-002",
    category="bottoms",
    closure_type="zipper-loop",
    adaptation_needs=("seated-wearing", "easy-access-medical", "adjustable-fit"),
)

PROTESIS = ProductInput(
    id="adp-009",
    category="prosthetics",
    closure_type="none",
    adaptation_needs=("prosthesis-friendly", "one-handed-dressing", "adjustable-fit"),
)

PERFIL_UNA_MANO = ProfileInput(
    needs=("one-handed-dressing", "no-fine-motor"),
    hand_dexterity="one-hand",
)


# --- Contrato: estas cuatro no se tocan ------------------------------------


def test_el_mismo_perfil_da_siempre_el_mismo_score():
    """La promesa central: el score es determinista y defendible."""
    primera = score_products(PERFIL_UNA_MANO, [CAMISA_MAGNETICA, CAMISA_CLASICA])
    segunda = score_products(PERFIL_UNA_MANO, [CAMISA_MAGNETICA, CAMISA_CLASICA])

    assert [item.score for item in primera] == [item.score for item in segunda]


def test_lo_que_cubre_puntua_mas_que_lo_que_no():
    resultados = score_products(PERFIL_UNA_MANO, [CAMISA_CLASICA, CAMISA_MAGNETICA])
    por_id = {item.product_id: item.score for item in resultados}

    assert por_id["adp-001"] > por_id["adp-006"]


def test_un_perfil_vacio_no_revienta():
    resultados = score_products(ProfileInput(), [CAMISA_MAGNETICA])

    assert len(resultados) == 1
    assert 0 <= resultados[0].score <= 100


def test_las_necesidades_no_cubiertas_tambien_se_devuelven():
    """Los `gap` se muestran igual que los `match`: no escondemos limitaciones."""
    resultados = score_products(PERFIL_UNA_MANO, [CAMISA_CLASICA])

    assert all(reason.status == "gap" for reason in resultados[0].reasons)
    assert len(resultados[0].reasons) == 2


# --- Reglas nuevas -----------------------------------------------------


def test_score_siempre_en_rango():
    perfil_exigente = ProfileInput(
        needs=(
            "one-handed-dressing",
            "seated-wearing",
            "sensory-friendly",
            "easy-access-medical",
        ),
        hand_dexterity="limited-grip",
        dressing_posture="seated",
        sensory_sensitivity="high",
        preferred_categories=("footwear",),
    )
    resultados = score_products(perfil_exigente, [CAMISA_CLASICA, CAMISA_MAGNETICA])

    assert all(0 <= item.score <= 100 for item in resultados)


def test_cierre_incompatible_penaliza_incluso_sin_necesidades_marcadas():
    """Con agarre limitado, una camisa de botones puntúa peor que una
    magnética, aunque el perfil no marque ninguna necesidad puntual."""
    perfil = ProfileInput(hand_dexterity="limited-grip")
    resultados = score_products(perfil, [CAMISA_CLASICA, CAMISA_MAGNETICA])
    por_id = {item.product_id: item.score for item in resultados}

    assert por_id["adp-001"] > por_id["adp-006"]


def test_vestirse_sentado_favorece_apertura_lateral():
    perfil = ProfileInput(dressing_posture="seated")
    resultados = score_products(perfil, [CAMISA_CLASICA, PANTALON_LATERAL])
    por_id = {item.product_id: item.score for item in resultados}

    assert por_id["adp-002"] > por_id["adp-006"]


def test_categorias_sin_ropa_ignoran_el_cierre():
    """Una prótesis no se "abrocha": el motor no debe penalizarla por
    closure_type aunque la destreza sea limitada."""
    perfil_limitado = ProfileInput(
        needs=("prosthesis-friendly",), hand_dexterity="limited-grip"
    )
    perfil_diestro = ProfileInput(
        needs=("prosthesis-friendly",), hand_dexterity="both-hands"
    )

    resultado_limitado = score_products(perfil_limitado, [PROTESIS])[0]
    resultado_diestro = score_products(perfil_diestro, [PROTESIS])[0]

    # Misma necesidad cubierta en ambos casos: el score no puede diferir
    # solo por la destreza de manos, porque acá no aplica.
    assert resultado_limitado.score == resultado_diestro.score


def test_empate_conserva_el_orden_de_entrada():
    """Con el mismo perfil vacío y el mismo tipo de cierre, dos productos
    sin necesidades marcadas deberían empatar y mantenerse en orden."""
    gemelo = ProductInput(
        id="adp-999",
        category="tops",
        closure_type="magnetic",
        adaptation_needs=(),
    )
    original = ProductInput(
        id="adp-998",
        category="tops",
        closure_type="magnetic",
        adaptation_needs=(),
    )
    resultados = score_products(ProfileInput(), [original, gemelo])

    assert [item.product_id for item in resultados] == ["adp-998", "adp-999"]


# --- Adaptaciones --------------------------------------------------------


def test_las_adaptaciones_solo_cubren_necesidades_no_cubiertas():
    from recommendations.adaptations import build_adaptations

    resultado = score_products(PERFIL_UNA_MANO, [CAMISA_CLASICA])[0]
    sugerencias = build_adaptations(resultado.reasons)

    assert len(sugerencias) > 0
    assert all(sugerencia.limitation for sugerencia in sugerencias)


def test_sin_necesidades_sin_cubrir_no_hay_sugerencias():
    from recommendations.adaptations import build_adaptations

    resultado = score_products(PERFIL_UNA_MANO, [CAMISA_MAGNETICA])[0]
    sugerencias = build_adaptations(resultado.reasons)

    assert sugerencias == []


# --- Explicación ----------------------------------------------------------


def test_explicacion_sin_clave_nunca_falla():
    from recommendations.explanation import explain

    resultado = score_products(PERFIL_UNA_MANO, [CAMISA_MAGNETICA])[0]
    texto = explain("Camisa Vera", resultado.score, resultado.reasons)

    assert isinstance(texto, str)
    assert str(resultado.score) in texto


def test_explicacion_menciona_lo_no_cubierto():
    from recommendations.explanation import explain

    resultado = score_products(PERFIL_UNA_MANO, [CAMISA_CLASICA])[0]
    texto = explain("Camisa Clásica", resultado.score, resultado.reasons)

    assert "no cubre" in texto.lower()
