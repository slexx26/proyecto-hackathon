"""Producto del catálogo. No es solo ropa."""

from .common import AdaptationNeed, ClosureType, ProductCategory
from .provider import CamelModel


class ProductImage(CamelModel):
    url: str
    # Obligatorio: sin alt la interfaz no es accesible.
    alt: str


class Product(CamelModel):
    id: str
    provider_id: str
    name: str
    brand: str
    category: ProductCategory
    price: int
    currency: str = "CRC"
    description: str
    images: list[ProductImage] = []
    adaptation_needs: list[AdaptationNeed] = []
    closure_type: ClosureType = "none"
    materials: list[str] = []
    limitations: list[str] = []
    sizes: list[str] = []
    in_stock: bool = True
