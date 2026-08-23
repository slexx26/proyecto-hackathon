# ADAPTA — frontend

React 19 · react-router-dom 7 · Vite 8 · TypeScript 6 · Tailwind 4 · oxlint 1.

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

Con `VITE_USE_MOCK_API=true` (por defecto) el recorrido completo funciona sin
backend. Ver `../CLAUDE.md` para las reglas de arquitectura del proyecto.

## Verificación antes de commitear

```bash
npm run lint        # oxlint, cero avisos
npm run typecheck   # tsc -b --force
npm run build
```

---

## Sistema de diseño

### Tokens: dos capas

`src/styles/theme.css` declara los tokens con `@theme` (Tailwind v4; **no hay
`tailwind.config.js`**). Están en dos capas y no son intercambiables:

| Capa | Ejemplos | Quién la usa |
|------|----------|--------------|
| Rampas crudas | `brand-500`, `clay-400` | Solo ilustraciones y degradados |
| Semántica | `surface`, `ink`, `action`, `fit-high-soft` | **Toda** la interfaz |

Un componente **nunca** dice `bg-brand-700 text-white`. Dice
`bg-action text-on-action`. El motivo es el modo oscuro: al cambiar de tema se
redefine la capa semántica y la aplicación entera cambia sin tocar un solo
componente. Con la rampa cruda, ese botón quedaría blanco sobre turquesa claro.

### Modo oscuro

Vive en `src/index.css`, fuera de `@layer` (el CSS sin capa gana al CSS con
capa, y `@theme` emite en `@layer theme`). Tres bloques: el sistema pide
oscuro y la persona no eligió claro · la persona eligió oscuro · la persona
eligió claro (gana `@theme`).

`index.html` aplica el tema guardado en un script en línea **antes del primer
pintado**: si eso viviera en React, se vería un destello blanco justo en lo
que el modo oscuro intenta evitar.

Control: `ThemeToggle` (cabecera, dos estados) y `ThemeChoice` (pie, incluye
"seguir al sistema"). Estado en `src/hooks/useTheme.ts`.

### Bordes: `line` vs `line-strong`

- `line` — separadores y cantos de tarjeta. Decorativo, puede ser tenue.
- `line-strong` — **borde de controles** (campos, botones secundarios, fichas
  de filtro). Un campo se identifica por su borde, así que WCAG 1.4.11 pide
  3:1 contra lo que tiene al lado. Por eso es más oscuro de lo que pediría el
  gusto: aquí manda la norma.

### Tipografía

- **Atkinson Hyperlegible Next** (cuerpo). La dibujó el Braille Institute para
  lectura con baja visión: cada carácter es inconfundible (I/l/1, 0/O, b/d).
  En un producto sobre accesibilidad, la fuente del cuerpo es una decisión de
  producto.
- **Bricolage Grotesque** (`font-display`, titulares). El nombre no es
  casualidad: bricolaje es lo que ADAPTA propone hacer con la ropa que ya
  existe.

Cargan desde Google Fonts con `display=swap` y stack de respaldo, así que la
página sigue legible si Fonts no responde.

### Movimiento

Curvas propias en `@theme` (`--ease-out-strong`, `--ease-overshoot`). Nada de
`ease-in` en la interfaz: arranca lento justo cuando la persona está mirando.

Las animaciones de entrada (`animate-rise`, `animate-fade`, `animate-pop`)
tienen el estado **final** en el CSS estático y solo el fotograma `from`
oculto. Si las animaciones no corren, el contenido se ve igual. Nunca dejes
contenido dependiendo de que una animación termine.

`prefers-reduced-motion` está cubierto globalmente en `src/index.css`.

### Ilustraciones

Todo vector en línea, dentro del bundle, pintado con tokens semánticos (siguen
al modo oscuro solas). Nada de peticiones externas ni fotografías: usar fotos
de personas o marcas reales falsearía el origen de los datos (sección 26).

- `CategoryIllustration` — una por `ProductCategory`. Las piezas marcadas con
  `data-accent` llevan el color cálido: el cierre, la correa, la empuñadura,
  es decir justo lo que resuelve el problema de accesibilidad de cada producto.
- `SpotIllustration` — estados vacío / error / 404 / enviado.
- `ProviderMark` — monograma con el icono del rubro. Los negocios son
  ficticios y no tienen logotipo; inventarles uno sería justo lo que el
  proyecto no debe hacer.

Son **decorativas**: van con `aria-hidden` y quien las usa pone el texto
alternativo real.

### Iconos

`src/components/ui/Icon.tsx`, un solo archivo, trazo 1.75, caja de 24.
**Nada de emoji**: cambia de dibujo en cada sistema operativo, no hereda el
color del texto y los lectores de pantalla lo leen entero ("marca de
verificación blanca gruesa").

---

## Accesibilidad — invariantes

Un producto sobre accesibilidad que no sea accesible se cae solo en la
presentación. Lo verificado, no lo aspiracional:

- **Contraste.** Todos los pares de tokens pasan AA (4.5:1) en ambos temas, la
  mayoría AAA. Los bordes de control pasan 3:1 (WCAG 1.4.11).
- **Foco visible** en todo lo enfocable, con un solo anillo para toda la app.
  Ningún `outline: none` en el proyecto.
- **Objetivos táctiles** de 44px mínimo. Las tarjetas usan enlace estirado
  (`after:absolute after:inset-0`): el objetivo es la tarjeta entera.
- **Formularios.** Todo control con `<label>` real; los grupos son
  `<fieldset>` con `<legend>`. En casillas y radios la etiqueta envuelve la
  ficha completa, así que el objetivo es la tarjeta, no el cuadradito.
  Controles **nativos** a propósito: reimplementarlos con `appearance: none`
  se ve más "de diseño" y rompe el alto contraste de Windows.
- **`aria-live`** en toda zona de resultados (recomendaciones, catálogo,
  directorio, compatibilidad del detalle).
- **El color nunca es el único portador.** El `ScoreBadge` lleva número,
  etiqueta en texto y arco relleno además del color. `ReasonList` lleva icono
  con forma propia y estado en texto para lector de pantalla.
- **Cuatro estados** —loading / success / empty / error— en toda pantalla con
  datos. Los tres no-felices viven juntos en `components/ui/states.tsx`: si
  alguien copia uno, ve los otros dos.
- **Jerarquía de encabezados** sin saltos. `WhereToGetIt` recibe el nivel por
  props porque aparece bajo un `h1` y bajo un `h3`.

## Find My Fit

`FitProfileForm` es un asistente de cuatro pasos con repaso final. Al cambiar
de paso el foco va al encabezado del paso, no al principio de la página.

Ojo con una trampa ya pagada: el botón "Siguiente" y el de envío ocupan la
misma posición del árbol, así que React reutiliza el nodo del DOM y solo le
cambia el `type`. Sin `key` distinta y `preventDefault()`, pulsar "Siguiente"
en el paso 3 enviaba el formulario y saltaba el repaso.
