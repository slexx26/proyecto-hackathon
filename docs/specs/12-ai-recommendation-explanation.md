# 12. AI Recommendation Explanation — Explicación

**Responsable:** Isaac  
**Apoya: Slater diseña cómo se muestra**  
**Prioridad: P0**

## Qué hace

Convierte la evidencia del motor en una explicación breve, humana y útil para la persona usuaria.

## Entregable

Prompt, esquema de salida y función que explique coincidencias y limitaciones sin inventar ni cambiar el score.

## Integración

Consume el desglose determinista y devuelve texto estructurado para Recommendations y Product Detail.

## Estado

**Completo.**

Misma función que la 11. Recibe `reasons` y `score` ya calculados, menciona lo que no cubre, sin afirmaciones médicas.
