# Guion de demo — ADAPTA

Sección 27 y 28 de `docs/specs/`. Esto no es código: es lo que se dice y en
qué orden, cronometrado. Léanlo los tres antes de presentar, y **ensáyenlo
en voz alta al menos dos veces completas** contra la app real, no leyéndolo.

## Configuración antes de entrar a la sala

- `VITE_USE_MOCK_API=true` en `frontend/.env.local`. **No demostrar contra
  el backend real** salvo que José confirme que los tres routers responden
  y que `supabase/seed.sql` ya corrió (ahora mismo no corrió: las tablas
  existen pero están vacías). Los mocks nunca se caen a mitad de demo; el
  backend en construcción sí puede.
- Pestaña del navegador ya abierta en `http://localhost:5173`, sin
  extensiones que puedan interferir.
- Zoom del navegador al 100%. Practicado en la resolución real del
  proyector, no en el laptop a solas.
- Batería cargada, notificaciones del sistema apagadas.
- Cerrar sesión de todo lo que no sea la demo: nada de pestañas con correo
  o Slack abiertas de fondo.

## El recorrido (≈4 minutos)

### 0:00 — Apertura (20 s)

> "ADAPTA es un directorio con IA de moda y vida accesible. No vendemos
> ropa: conectamos a personas con discapacidad con los negocios que ya
> hacen ropa adaptada, prótesis, calzado y ayudas técnicas, y que hoy nadie
> encuentra."

Landing en pantalla. No hacer scroll todavía.

### 0:20 — El problema (25 s)

Scroll hasta el bloque oscuro de la landing ("Para mucha gente, comprar
ropa es adivinar").

> "El problema es doble. La persona no sabe si una prenda se abrocha con
> una mano o si se pone estando sentada. Y el negocio que sí lo resuelve
> está disperso entre grupos de Facebook y no lo encuentra nadie."

### 0:45 — Find My Fit (45 s)

Clic en "Encontrá tu fit". Llenar el formulario en vivo, no de memoria:

- Marcar 2-3 necesidades (recomendado: **una mano** y **vestirse
  sentado**, porque el catálogo de demo está diseñado para mostrar
  diferencias claras con esa combinación).
- Pasar rápido por destreza, postura y sensibilidad.
- **No** llenar el campo de notas libres: alarga la demo sin sumar nada
  visual.

> "No preguntamos diagnóstico ni medidas del cuerpo. Preguntamos barreras
> concretas: qué te cuesta hacer, no qué tenés."

### 1:30 — Recomendaciones (60 s, la parte más importante)

Enviar el formulario. Aterriza en `/recommendations`.

> "Esto no lo ordena la IA. Lo calcula un motor de reglas deterministas:
> mismo perfil, mismo resultado, siempre. La IA solo explica por qué."

Señalar en la primera tarjeta, en este orden:
1. El score (número + etiqueta, nunca solo color).
2. La explicación en español.
3. La lista de razones — **incluyendo alguna que diga "no cubierto"**.
   Esto es clave: mostrar que el sistema no esconde lo que no resuelve.
4. El bloque "Dónde conseguirlo" al final de la tarjeta.

> "Y siempre termina diciendo dónde conseguirlo. Una recomendación sin
> proveedor deja a la persona igual que al empezar."

### 2:30 — Detalle y adaptación (45 s)

Clic en una prenda con adaptaciones pendientes (la Camisa Clásica de
Lienzo es la mejor candidata: no cubre nada de fábrica).

> "Esta no la resuelve tal cual. Pero le proponemos una adaptación
> concreta: qué se hace, qué gana la persona, y qué sigue sin
> resolverse. Nunca escondemos la limitación."

### 3:15 — El otro lado: el negocio (30 s)

Ir a `/for-business`.

> "El modelo de negocio es de dos lados. La persona busca gratis. El
> negocio paga por inscribirse, porque le lleva clientes que hoy no lo
> encuentran. Esto no cobra de verdad todavía —es la propuesta— pero el
> flujo de solicitud sí funciona."

### 3:45 — Cierre (15 s)

Volver a la landing.

> "ADAPTA: necesidad, compatibilidad explicada, y a quién acudir. Gracias."

## Plan B — qué hacer si algo falla en vivo

| Falla | Qué hacer |
|---|---|
| El servidor de desarrollo no responde | Tener una segunda terminal con `npm run dev` ya corriendo de respaldo, o una grabación de pantalla del recorrido completo como último recurso |
| El formulario no envía | Tener un perfil ya guardado de una corrida anterior: refrescar `/recommendations` sin pasar por el formulario |
| Preguntan por el backend | "El motor y la base están en construcción; el contrato de API ya está fijado y el frontend funciona igual con datos reales o simulados, porque nunca calcula el score, solo lo muestra." Es verdad y es una respuesta fuerte, no una excusa |
| Preguntan por pagos | "El cobro no se implementa a propósito: mostramos los planes y el flujo de solicitud, pero procesar pagos reales está fuera del alcance de 48 horas" |
| Alguien pide navegar solo con teclado | Practicarlo antes. Tab por el formulario completo tiene que llegar a todos los campos, con foco visible en cada uno |

## Antes de la sala: checklist de ensayo

- [ ] Recorrido completo cronometrado en voz alta, dos veces, contra la
      app real (no leyendo este documento)
- [ ] Probado en la máquina y el navegador que se va a usar en la
      presentación, no solo en la del desarrollador
- [ ] El recorrido completo navegado **solo con teclado** (Tab, Shift+Tab,
      Enter, Espacio), sin usar el mouse ni una vez
- [ ] Decidido quién habla en cada tramo, si presentan varios
- [ ] `VITE_USE_MOCK_API` confirmado en `true` justo antes de entrar
- [ ] Verificado que nadie dejó el formulario a medio llenar de un ensayo
      anterior (perfil en `sessionStorage`: refrescar la pestaña lo limpia)
