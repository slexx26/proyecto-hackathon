# 10. Compatibility Engine — Motor

**Responsable:** Isaac  
**Apoya: José integra el módulo y la API**  
**Prioridad: P0**

## Qué hace

Compara necesidades estructuradas con características de cada prenda y calcula un score reproducible mediante reglas deterministas.

## Entregable

Módulo Python tipado con reglas, pesos, desglose de razones, ranking y pruebas unitarias.

## Integración

Recibe perfiles y productos; devuelve scores y evidencia que luego la IA puede explicar, pero no modificar.

## Estado

**Completo.**

`backend/recommendations/engine.py`. Función pura, sin red ni aleatoriedad: base fija + reparto por necesidad + contexto (cierre/destreza, postura, sensibilidad, categoría preferida) sin duplicar razones. Las categorías sin ropa (`prosthetics`, `orthotics`, `mobility`, `daily-living`) ignoran el cierre a propósito. 15 pruebas, 4 de ellas fijadas como contrato desde el principio.
