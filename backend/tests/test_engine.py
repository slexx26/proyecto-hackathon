"""Pruebas del motor. Estas tres tienen que seguir pasando pase lo que pase
con las reglas de Isaac: son las propiedades que el producto promete.
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

PERFIL_UNA_MANO = ProfileInput(
    needs=("one-handed-dressing", "no-fine-motor"),
    hand_dexterity="one-hand",
)


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
