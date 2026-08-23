# Contrato de API — ADAPTA

> **Estado:** propuesto por el frontend, **pendiente de validación por José.**
>
> El frontend ya consume exactamente estas formas. Si el backend necesita
> cambiar algo, se cambia aquí y en `frontend/src/types/` en el mismo PR o en
> PRs coordinados. No se cambia en silencio.

Base: `/api/v1` · Todo JSON en UTF-8 · Los nombres de campo en los cuerpos van
en `camelCase`; los parámetros de query en `snake_case`.

## Convención de respuesta

**Sin cerrar.** El cliente acepta hoy las dos formas:

```json
{ "data": { ... } }
```
```json
{ ... }
```

Cuando José decida, el único punto a tocar en el frontend es la función
`unwrap()` de `frontend/src/services/api/client.ts`.

## Errores

Formato de FastAPI por defecto. El frontend lee `detail`:

```json
{ "detail": "El producto no existe." }
```

| Código | Cuándo |
|--------|--------|
| 400 | Payload inválido (archivo no permitido, tamaño excedido) |
| 404 | Recurso inexistente |
| 422 | Falla la validación de Pydantic |
| 500 | Error interno. **Nunca** devolver trazas ni nombres de tabla |
| 503 | OpenAI o Supabase no disponibles |

Cuando OpenAI falle, **no devolver 500**: devolver la recomendación sin el
campo `explanation`. El frontend ya degrada mostrando solo la evidencia
determinista.

---

## `GET /health`

```json
{ "status": "ok", "version": "0.1.0" }
```

## `GET /products`

Query, todos opcionales: `search`, `category`, `adaptation_need`, `provider_id`.

Devuelve `Product[]`.

```json
[
  {
    "id": "adp-001",
    "name": "Camisa Vera de cierre magnético",
    "brand": "Vera Studio",
    "providerId": "prv-001",
    "category": "tops",
    "price": 42000,
    "currency": "CRC",
    "description": "Camisa de popelina con botones decorativos sobre cierre magnético oculto.",
    "images": [{ "url": "/products/camisa-vera.svg", "alt": "Camisa celeste de manga larga" }],
    "adaptationNeeds": ["one-handed-dressing", "magnetic-closure", "no-fine-motor"],
    "closureType": "magnetic",
    "materials": ["Algodón 97%", "Elastano 3%"],
    "limitations": ["Los imanes pueden interferir con marcapasos."],
    "sizes": ["S", "M", "L", "XL"],
    "inStock": true
  }
]
```

## `GET /products/{id}`

Devuelve un `Product`. **404** si no existe.

## `POST /recommendations`

```json
{
  "profile": {
    "needs": ["one-handed-dressing", "seated-wearing"],
    "dressingAssistance": "independent",
    "handDexterity": "one-hand",
    "dressingPosture": "seated",
    "sensorySensitivity": "none",
    "preferredCategories": ["tops"],
    "notes": "Me cuesta más por las mañanas."
  }
}
```

Respuesta. **Ordenada por `score` descendente desde el servidor**: el frontend
no reordena.

```json
{
  "recommendations": [
    {
      "product": { "...Product..." },
      "provider": { "...Provider..." },
      "score": 92,
      "reasons": [
        {
          "need": "one-handed-dressing",
          "status": "match",
          "weight": 18,
          "label": "Se puede poner con una sola mano"
        }
      ],
      "explanation": "Obtiene 92 de 100 porque cubre…",
      "adaptations": [
        {
          "id": "adapt-magnetic",
          "title": "Sustituir la botonadura por cierre magnético",
          "description": "Un taller reemplaza los botones por imanes ocultos.",
          "benefit": "Se abrocha con una mano y sin pinza fina.",
          "limitation": "Los imanes requieren consulta si se usa marcapasos.",
          "effort": "medium"
        }
      ]
    }
  ],
  "generatedAt": "2026-08-22T19:04:00Z"
}
```

Reglas del campo `score`:

- Entero **0–100**.
- **Determinista**: mismo perfil + mismo catálogo ⇒ mismo score, siempre.
- Lo calcula el compatibility engine. OpenAI **no lo toca**.

Reglas de `reasons`: es la evidencia verificable. `status` ∈ `match` |
`partial` | `gap`. El frontend muestra los `gap` igual que los `match`: las
limitaciones no se esconden.

`explanation` es **opcional**. Si OpenAI falla, se omite el campo.

## `POST /chat`

```json
{
  "message": "¿Los imanes son seguros?",
  "history": [{ "id": "1", "role": "assistant", "content": "¡Hola!", "createdAt": "..." }],
  "productId": "adp-001"
}
```

```json
{
  "reply": {
    "id": "srv-42",
    "role": "assistant",
    "content": "Los cierres magnéticos se abrochan con una mano…",
    "createdAt": "2026-08-22T19:05:00Z",
    "productId": "adp-003",
    "productName": "Tenis Paso sin cordones"
  }
}
```

`productId` y `productName` son **opcionales**, siempre van juntos. Cuando
el asistente identifica una prenda concreta en la pregunta ("quiero unos
tenis Paso sin cordones"), la interfaz muestra un botón que lleva directo al
detalle del producto y a "dónde conseguirlo" — el mismo bloque que ya usan
Recommendations y Product Detail. Si el backend no los rellena, el mensaje
se ve igual, solo sin el botón: no rompe nada dejarlos vacíos.

Límites de seguridad: el asistente **no da consejo médico** y **no inventa
puntajes**. Si le preguntan por compatibilidad, remite al motor.

## `POST /image-analysis` — P2

`multipart/form-data`, campo `file`. Máximo 5 MB. Solo `image/jpeg`,
`image/png`, `image/webp`.

```json
{
  "detectedClosures": ["buttons"],
  "detectedFeatures": ["botonadura frontal", "puño abotonado"],
  "disclaimer": "Este análisis mira únicamente la prenda de la foto. No evalúa a ninguna persona."
}
```

**Restricción dura:** analiza **prendas**, nunca personas. No infiere
discapacidad, no diagnostica, no estima medidas corporales.

---

## `GET /providers`

Query, todos opcionales: `search`, `kind`, `verified_only`.

Devuelve `Provider[]`, **ya ordenado por el servidor**: primero `featured`,
luego `verified`, luego `free`; dentro de cada grupo, alfabético. Ese orden es
lo que el negocio compra al inscribirse, así que se decide en el backend, no
en el navegador.

```json
[
  {
    "id": "prv-001",
    "name": "Vera Studio",
    "kind": "adaptive-apparel",
    "description": "Taller de confección especializado en camisería con cierre magnético.",
    "location": "San José, Costa Rica",
    "shipsNationwide": true,
    "contact": {
      "website": "https://ejemplo.test/vera",
      "phone": "+506 0000 0001",
      "email": null
    },
    "plan": "featured",
    "verified": true
  }
]
```

## `GET /providers/{id}`

Devuelve un `Provider`. **404** si no existe.

## `POST /providers/applications`

Solicitud de inscripción de un negocio. **No procesa ningún pago** (sección 36):
recoge la solicitud y el cobro se coordina fuera de la plataforma.

```json
{
  "businessName": "Taller Puntada Abierta",
  "kind": "adaptation-workshop",
  "location": "Cartago, Costa Rica",
  "email": "contacto@ejemplo.test",
  "description": "Modificamos ropa que ya tenés."
}
```

```json
{ "received": true }
```

Validar el correo y limitar la longitud de `description`. Este endpoint es
público: conviene un límite de peticiones por IP.

---

## Vocabularios cerrados

Estos valores viajan como códigos estables. La interfaz los traduce al español
en `frontend/src/utils/labels.ts`; cambiar la redacción no cambia el contrato.

**`AdaptationNeed`**
`one-handed-dressing` · `seated-wearing` · `magnetic-closure` ·
`no-fine-motor` · `sensory-friendly` · `easy-access-medical` ·
`prosthesis-friendly` · `adjustable-fit` · `thermoregulation`

**`ProductCategory`**
`tops` · `bottoms` · `outerwear` · `footwear` · `underwear` · `accessories` ·
`prosthetics` · `orthotics` · `mobility` · `daily-living`

**`ProviderKind`**
`adaptive-apparel` · `adaptation-workshop` · `prosthetics` · `mobility-aids` ·
`daily-living-aids`

**`ProviderPlan`**
`free` · `verified` · `featured`

**`ClosureType`**
`magnetic` · `velcro` · `zipper-loop` · `zipper` · `buttons` · `elastic` · `none`

**`DressingAssistance`** `independent` · `partial-help` · `full-help`
**`HandDexterity`** `both-hands` · `one-hand` · `limited-grip`
**`DressingPosture`** `standing` · `seated` · `lying-down`
**`SensorySensitivity`** `none` · `mild` · `high`
**`MatchReason.status`** `match` · `partial` · `gap`
**`AdaptationSuggestion.effort`** `low` · `medium` · `high`

## Variables de entorno del backend

`backend/.env.example`, todas vacías en el repositorio:

```
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
DATABASE_URL=
FRONTEND_ORIGIN=http://localhost:5173
```

CORS: permitir únicamente el origen de `FRONTEND_ORIGIN`. Nada de `*`.
