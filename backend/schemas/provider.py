"""Proveedor: el negocio inscrito en el directorio."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .common import ProviderKind, ProviderPlan


def _camel(field: str) -> str:
    head, *tail = field.split("_")
    return head + "".join(word.capitalize() for word in tail)


class CamelModel(BaseModel):
    """Los cuerpos JSON viajan en camelCase; el Python queda en snake_case."""

    model_config = ConfigDict(alias_generator=_camel, populate_by_name=True)


class ProviderContact(CamelModel):
    website: str | None = None
    phone: str | None = None
    email: str | None = None


class Provider(CamelModel):
    id: str
    name: str
    kind: ProviderKind
    description: str
    location: str
    ships_nationwide: bool
    contact: ProviderContact
    plan: ProviderPlan
    verified: bool


class ProviderApplication(CamelModel):
    """Solicitud de inscripción. NO procesa ningún pago."""

    business_name: str = Field(min_length=2, max_length=120)
    kind: ProviderKind
    location: str = Field(min_length=2, max_length=120)
    email: EmailStr
    description: str = Field(min_length=10, max_length=400)


class ProviderApplicationReceipt(CamelModel):
    received: bool = True
