# ADR 001: Adopción de arquitectura Monolito Modular

**Estado:** Aprobada

## Contexto

LearnPro es una plataforma educativa en línea en etapa inicial. Requiere una estructura mantenible, simple de desplegar y capaz de crecer progresivamente.

## Decisión

Se adoptó una arquitectura Monolito Modular para el backend de LearnPro.

## Justificación

- Permite mantener todo en un único despliegue, facilitando la integración.
- La modularización interna permite separar responsabilidades (auth, usuarios, cursos, etc).
- Ideal para equipos pequeños y proyectos en crecimiento.
- Es posible migrar a microservicios más adelante si la escala lo requiere.

## Consecuencias

- El backend será un único servicio (NestJS) con múltiples módulos internos.
- Menor complejidad operativa y de despliegue inicial.
- Mayor cohesión interna pero acoplamiento inevitable entre módulos.
