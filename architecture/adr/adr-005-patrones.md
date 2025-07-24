# ADR 005: Aplicación de patrones de diseño: Repository, Strategy, Factory, Singleton

**Estado:** Aprobada

## Contexto

El backend requiere flexibilidad, testeo fácil y separación de responsabilidades.

## Decisión

Se aplicarán los siguientes patrones de diseño en el backend de LearnPro:

- Repository
- Strategy
- Factory
- Singleton

## Justificación

- **Repository** permite desacoplar la lógica de negocio de la persistencia.
- **Strategy** facilita intercambiar comportamientos (p. ej. diferentes métodos de pago).
- **Factory** permite crear objetos complejos desde una única interfaz.
- **Singleton** asegura una sola instancia para servicios compartidos (como configuraciones).

## Consecuencias

- Mejora la mantenibilidad del código.
- Puede agregar complejidad inicial al desarrollo, pero facilita la escalabilidad futura.
