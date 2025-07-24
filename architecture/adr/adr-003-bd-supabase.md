# ADR 003: Uso de Supabase PostgreSQL como base de datos

**Estado:** Aprobada

## Contexto

Se requiere una base de datos robusta, escalable y que no requiera infraestructura propia en esta etapa.

## Decisión

Se decidió utilizar Supabase como servicio gestionado de PostgreSQL.

## Justificación

- PostgreSQL es un RDBMS maduro, confiable y con amplio soporte.
- Supabase ofrece autenticación, API REST, reglas de seguridad (RLS) y backups automáticos.
- Elimina la necesidad de administrar infraestructura de base de datos.

## Consecuencias

- El backend se conectará directamente a Supabase.
- Habrá que configurar políticas de seguridad (RLS) y manejo de credenciales.
