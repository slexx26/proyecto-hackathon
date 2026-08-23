# Encargo para Isaac — Motor de compatibilidad e IA

Ya te dejé el esqueleto montado y **las pruebas pasan**. Lo que falta son tus
reglas: el archivo `backend/recommendations/engine.py` tiene un marcador de
posición tonto que hay que reemplazar entero.

## Levantalo

```powershell
git clone https://github.com/slexx26/proyecto-hackathon.git
cd proyecto-hackathon
git checkout feature/frontend
git checkout -b feature/ai

cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m pytest
```

### Ojo con PowerShell (terminal de VS Code)

**No uses `.venv\Scripts\activate`.** En Windows suele fallar con
*"running scripts is disabled on this system"*, porque la política de
ejecución bloquea el script. Por eso arriba se llama directo a
`.venv\Scripts\python.exe`: hace exactamente lo mismo y no depende de la
política. Es como lo probé yo.

Si preferís activarlo igual, primero:

```powershell
Set-ExecutionPolicy -Scope Process -Bypass
.venv\Scripts\Activate.ps1
```

Eso vale solo para esa ventana, no cambia nada del sistema.

**Y no encadenes con `&&`.** PowerShell 5.1 (el que trae Windows por defecto)
no lo soporta y te da error de sintaxis. Poné un comando por línea, o usá `;`.

Para copiar el archivo de entorno, en PowerShell:

```powershell
Copy-Item .env.example .env
```

Tienen que pasar 6 pruebas.

Verificado en Python 3.14: `supabase` y `openai` instalan con ruedas nativas,
sin compilar nada.

## Lo que ya está escrito

```
backend/recommendations/
├── models.py    ProfileInput, ProductInput, Reason, Scored
└── engine.py    score_products() — LA FIRMA ESTÁ, LAS REGLAS SON TUYAS
backend/tests/
└── test_engine.py   4 pruebas que tienen que seguir pasando
```

Esas cuatro pruebas son las propiedades que el producto promete: que el mismo
perfil da siempre el mismo score, que lo que cubre puntúa más que lo que no,
que un perfil vacío no revienta, y que las necesidades no cubiertas también se
devuelven. Cambiá las reglas todo lo que quieras; esas pruebas se quedan.

## La regla que define tu trabajo

**El motor puntúa. La IA explica. La IA nunca puntúa.**

Si OpenAI pudiera mover el score, el mismo perfil daría resultados distintos
en cada demo y no podríamos defender el número ante el jurado. El motor es
determinista: mismo perfil + mismo catálogo ⇒ mismo score, siempre.

## Tu entrega, en orden

### 1. Compatibility Engine (P0, lo más importante)

Módulo Python tipado, sin dependencias de FastAPI ni de OpenAI. Entra un
perfil y una lista de productos; sale una lista de recomendaciones.

```
backend/recommendations/
├── engine.py       reglas, pesos, cálculo del score
├── rules.py        las reglas por separado, para poder testearlas
└── models.py       tipos internos
```

**Entrada** (`FitProfile`, ver `frontend/src/types/fit-profile.ts`):

| Campo | Valores |
|-------|---------|
| `needs` | lista de `AdaptationNeed` — lo que más pesa |
| `handDexterity` | `both-hands` · `one-hand` · `limited-grip` |
| `dressingPosture` | `standing` · `seated` · `lying-down` |
| `dressingAssistance` | `independent` · `partial-help` · `full-help` |
| `sensorySensitivity` | `none` · `mild` · `high` |
| `preferredCategories` | lista de `ProductCategory` |
| `notes` | texto libre opcional |

**Salida**: `score` entero 0–100, más `reasons`.

`reasons` es lo que más me importa a mí en el frontend: es la evidencia que la
persona puede verificar con sus propios ojos, y lo único que queda en pantalla
si OpenAI se cae. Cada razón lleva:

```python
{
  "need": "one-handed-dressing",   # qué necesidad evalúa
  "status": "match",               # match | partial | gap
  "weight": 18,                    # cuánto aportó al score
  "label": "Se puede poner con una sola mano"   # frase corta, determinista
}
```

**Los `gap` también se devuelven.** El frontend los pinta igual que los
`match`. No escondemos lo que un producto no resuelve.

Hay un suplente tuyo funcionando en
`frontend/src/services/mocks/recommendations.mock.ts`. Miralo para ver qué
formas espera la interfaz, pero **no lo copies**: es una maqueta con pesos
inventados. Tus reglas tienen que ser mejores y estar justificadas. Cuando tu
motor responda, ese archivo se borra entero.

Cosas que las reglas deberían considerar y el suplente no hace bien:

- El tipo de cierre contra la destreza real. Botones + `limited-grip` debería
  hundir el score, no restarle un poco.
- La postura. Si la persona se viste sentada, una prenda que se pone por la
  cabeza es peor que una cruzada.
- Que el catálogo **no es solo ropa**. Una prótesis o una silla de ruedas no
  se evalúan con las mismas reglas que una camisa: `closureType` no significa
  nada ahí. Decidí qué hacés con esas categorías y dejalo escrito.

**Pruebas unitarias obligatorias.** Al menos: que el mismo perfil dé siempre
el mismo score, que un perfil vacío no reviente, y que un producto que cubre
todo puntúe más que uno que no cubre nada.

### 2. AI Service (P0)

`backend/ai/service.py`. Centraliza **todas** las llamadas a OpenAI.

- `OPENAI_API_KEY` se lee del entorno, solo en backend. Nunca en el frontend.
- Salida estructurada validada con Pydantic. Si no valida, se descarta.
- Timeout corto. Si OpenAI tarda o falla: **devolvé la recomendación sin
  `explanation`**, no un error. El frontend ya degrada solo.

### 3. Explicación de recomendaciones (P0)

Función que recibe el desglose determinista y devuelve texto en español,
breve y humano.

Reglas del prompt:

- Recibe `reasons` y `score` **ya calculados**. No los recalcula ni los
  discute.
- No inventa características que el producto no tiene.
- Menciona también lo que **no** resuelve.
- Sin afirmaciones médicas. No le dice a la persona qué le pasa ni qué debería
  hacer con su cuerpo.

El frontend lo muestra en la tarjeta de recomendación y en el detalle.

### 4. Sugerencias de adaptación (P0, compartido conmigo)

Para cada necesidad que quedó en `gap`, proponé una modificación:

```python
{
  "id": "adapt-magnetic",
  "title": "Sustituir la botonadura por cierre magnético",
  "description": "Qué se hace, en concreto",
  "benefit": "Qué gana la persona",
  "limitation": "Qué sigue sin resolverse",   # obligatorio, no lo dejes vacío
  "effort": "low"                              # low | medium | high
}
```

`limitation` no es opcional. La interfaz lo muestra con el mismo peso visual
que `benefit`, en un panel al lado. Si mandás una cadena vacía se ve el hueco.

### 5. Chatbot (P1)

`POST /api/v1/chat`. Asistente pequeño y acotado: aclara dudas sobre cierres,
formas de vestirse y adaptaciones.

Límites duros: **no da consejo médico** y **no inventa puntajes**. Si le
preguntan por compatibilidad, remite al motor. No es el producto principal.

### 6. Análisis de imagen (P2, solo si sobra tiempo)

Analiza la foto de un **producto**, nunca de una persona. No infiere
discapacidad, no diagnostica, no estima medidas corporales. Tiene que poder
borrarse sin romper nada.

## Con quién te coordinás

- **José** integra tu módulo en `POST /api/v1/recommendations` y te da acceso
  a los productos. Ponete de acuerdo con él sobre la firma de la función.
- **Yo (Slater)** consumo tu salida. Si cambiás la forma de `reasons` o de
  `adaptations`, decímelo antes: son las formas que ya pinta la interfaz.

## Antes de pasármelo

```powershell
.venv\Scripts\python.exe -m pytest
```

Que no se cuele ninguna clave: `git diff` antes de commitear, y buscá `sk-`
en el diff.

## Cómo me lo pasás

```powershell
git add .
git commit -m "feat(ai): describir el cambio"
git push -u origin feature/ai
```

Y me avisás. **No mergees a `main` ni a `feature/frontend`.**

## Lo que espero de vuelta

1. Los pesos y reglas que elegiste, y por qué.
2. Qué hacés con las categorías que no son ropa.
3. Confirmación de que un mismo perfil da siempre el mismo score.
4. Si cambiaste alguna forma del contrato, cuál.
