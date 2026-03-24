# BTG Funds Web Application

This is a modern web application built with Angular, designed for managing FPV/FIC funds as part of a front-end technical test.

The solution enables a single user to browse available funds, subscribe with balance and minimum amount validation, cancel active participations, and review transaction history in a clear and responsive interface.

## Key Features

- Browse and view available funds catalog.
- Subscribe to funds with minimum amount and balance checks.
- Cancel active participations with refund to main balance.
- Chronological transaction history of subscriptions and cancellations.
- Choose notification method upon subscription: email or SMS.
- Visual feedback including skeletons, loading states, and toast notifications.

## Technology Stack

- Angular 18 using standalone components.
- TypeScript for type safety.
- Angular Router for navigation.
- Signals for local application state management.
- RxJS for asynchronous operations simulation.
- Tailwind CSS for utility-first styling and responsive layouts.

## Prerequisites

- Node.js version 18 or higher.
- npm version 9 or higher.

## Getting Started

1. Clone the repository.
2. Install dependencies.
3. Start the development server.

```bash
npm install
npm start
```

The application will be available at the URL provided by Angular CLI, typically:

```bash
http://localhost:4200/
```

## Available Scripts

```bash
npm start   # Start development server
```
npm run build   # build de producción
npm run watch   # build en modo watch
npm test   # pruebas unitarias con Jest + Angular Testing Library
npm run test:coverage   # reporte de cobertura
```

## Datos base de la prueba

La aplicación asume un único usuario con saldo inicial de COP $500.000.

Fondos configurados:

| ID | Nombre | Monto mínimo | Categoría |
| --- | --- | ---: | --- |
| FPV_BTG_PACTUAL_RECAUDADORA | FPV BTG Pactual Recaudadora | COP $75.000 | FPV |
| FPV_BTG_PACTUAL_ECOPETROL | FPV BTG Pactual Ecopetrol | COP $125.000 | FPV |
| DEUDAPRIVADA | FPV BTG Pactual Deuda Privada | COP $50.000 | FIC |
| FDO-ACCIONES | FIC BTG Pactual Renta Variable | COP $250.000 | FIC |
| FPV_BTG_PACTUAL_DINAMICA | FPV BTG Pactual Dinámica | COP $100.000 | FPV |

## Navegación

- `/dashboard`: resumen de saldo, patrimonio y fondos activos.
- `/funds`: catálogo de fondos disponibles y gestión de suscripciones activas.
- `/transactions`: historial de transacciones.

## Arquitectura del proyecto

```text
src/app/
  core/
    models/      modelos de dominio
    pipes/       utilidades de presentación
    services/    estado y lógica de negocio
  features/
    dashboard/           vista de resumen
    fund-list/           catálogo y cancelaciones
    fund-subscribe/      flujo de suscripción
    transaction-history/ historial de movimientos
  shared/
    components/  componentes reutilizables
    services/    utilidades compartidas
```

### Decisiones de implementación

- El estado principal de la aplicación se centraliza en `FundService` usando Angular Signals.
- La simulación de backend se consume desde una capa mock explícita con `HttpClient` y archivos locales, evitando acoplar el catálogo directamente al servicio de dominio.
- Las validaciones críticas se implementan en dos niveles:
  - UI: validaciones reactivas de formulario.
  - Dominio: validaciones en el servicio antes de mutar estado.
- El formato monetario se centraliza en un pipe dedicado para mantener consistencia visual en toda la aplicación.

## Tradeoffs y decisiones

- Se eligió un mock local con `HttpClient` sobre `json-server` para mantener la prueba autocontenida y ejecutable sin procesos adicionales, pero conservando una separación clara entre acceso a datos y lógica de negocio.
- El catálogo permanece completo y visible incluso cuando un fondo ya está suscrito. La tarjeta cambia de estado visual a `Activo` o `Ya suscrito` para evitar ambigüedad y mantener trazabilidad respecto a los 5 fondos del enunciado.
- `FundService` concentra estado y reglas de negocio, mientras que `MockFundsApiService` encapsula el contrato de la API simulada. Esa división mantiene las decisiones de dominio aisladas del detalle de transporte.

## Flujo funcional relevante

### Suscripción

Al intentar suscribirse a un fondo, la aplicación valida:

- que el monto ingresado sea mayor o igual al monto mínimo del fondo,
- que el usuario tenga saldo suficiente,
- que la operación refleje el método de notificación seleccionado.

Si la operación es exitosa:

- se descuenta el valor del saldo disponible,
- se registra la suscripción activa,
- se agrega una transacción al historial,
- se informa el resultado mediante un toast.

### Cancelación

Al cancelar una suscripción activa:

- se elimina la participación del listado de fondos activos,
- se reintegra el valor invertido al saldo principal,
- se registra la cancelación en el historial,
- se muestra feedback visual durante el procesamiento.

## Simulación de API

La aplicación consume un mock API explícito separado de la lógica de negocio.

- El catálogo de fondos se sirve desde [public/mock-api/funds.json](public/mock-api/funds.json).
- La capa de acceso mock está encapsulada en `MockFundsApiService`.
- `FundService` conserva las reglas de negocio y el estado de la aplicación, pero ya no define el catálogo embebido dentro del servicio.

Las operaciones de suscripción y cancelación siguen simuladas localmente porque la prueba no requiere backend real, pero ahora pasan por una capa API mock dedicada para mantener una separación más clara entre acceso a datos y dominio.

## Build de producción

Para generar el build optimizado:

```bash
npm run build
```

La salida se genera en:

```text
dist/btg-funds
```

## Estado actual y consideraciones

- La aplicación está enfocada en un escenario de usuario único, sin autenticación.
- La persistencia es en memoria; al recargar la página se reinicia el estado.
- Se incluyeron pruebas unitarias base de componentes con Jest y Angular Testing Library.
- No se implementa backend, despliegue ni integración con proveedores reales de mensajería.

## Criterios de calidad aplicados

- Separación clara entre presentación, estado y reglas de negocio.
- Componentes standalone y rutas lazy para mantener bajo acoplamiento.
- Validaciones explícitas en UI y servicio.
- Feedback visual en operaciones sensibles.
- Diseño adaptable para móvil, tablet y desktop con ajustes específicos por vista.
