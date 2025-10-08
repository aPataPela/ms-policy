# ms-policy
Microservicio en Node.js/TypeScript para administrar pólizas de seguros, incluyendo creación, búsqueda y actualización de estado.

## Arquitectura general
- **Express 5** expone rutas bajo `/api/policies`.
- **Awilix** gestiona la inyección de dependencias para controladores y casos de uso.
- **NeDB (nedb-promises)** actúa como persistencia embebida.
- Patrón hexagonal: capa de aplicación (`PolicyCreator`, `PolicySearcher`, `PolicyUpdater`) orquesta lógica y comunica con la capa de infraestructura (`NePolicyRepository`).

## Rutas principales
- `POST /api/policies`: crea una póliza nueva.
- `GET /api/policies`: busca pólizas filtrando opcionalmente por `estado` o `fechaEmision`.
- `GET /api/policies/:id`: obtiene una póliza por identificador.
- `PUT /api/policies/:id/status`: actualiza el estado de una póliza existente.

Cada endpoint está mediado por middlewares de validación basados en **Zod**, que aseguran datos consistentes antes de invocar la lógica de negocio.

## Validaciones de esquema
### Creación (`policy-create-schemma`)
- `id`: UUID v7 obligatorio (`z.uuidv7()`).
- `rutTitular`: string mínimo 10 caracteres.
- `fechaEmision`: string obligatorio en formato `YYYY-MM-DD`, convertido a `Date`.
- `planSalud`: string no vacío.
- `prima`: número finito.
- `estado`: enum `emitida | activa | anulada`.
- Mensajes personalizados traducen ausencias, tipos incorrectos y formato de fecha.

### Búsqueda (`policy-search-schemma`)
- Solo acepta `estado` y `fechaEmision` como query params.
- `estado`: enum `emitida | activa | anulada`.
- `fechaEmision`: string `YYYY-MM-DD`, convertido a `Date`.
- Cualquier parámetro extra retorna `422` con "Only estado and fechaEmision query parameters are allowed".
- Resultados parseados se almacenan en `res.locals.policySearch` para preservar `req.query`.

### Actualización de estado (`policy-update-schemma`)
- Body debe ser un objeto con un único campo `estado`.
- `estado`: enum `emitida | activa | anulada`.
- Payloads con campos adicionales responden `422` con "Only estado field is allowed".

## Puesta en marcha
1. **Instalación**: `npm install`
2. **Desarrollo**: `npm run dev` (usa `tsx watch`).
3. **Build**: `npm run build`

La base de datos (`data/collection.db`) se inicializa automáticamente mediante NeDB. Puedes limpiar la data borrando el archivo (en caliente si el proceso está detenido) para iniciar con un dataset vacío.

## Pruebas
- **Framework:** [Vitest](https://vitest.dev/) con entorno Node (`npm test` ejecuta `vitest run`, `npm run test:watch` lo lanza en modo interactivo).
- **Cobertura actual:**
  - `tests/policy.domain.test.ts`: asegura que `Policy.create` construye instancias con todos los atributos esperados y que cada póliza es independiente.
  - `tests/ne-policy-repository.test.ts`: ejercita el repositorio `NePolicyRepository` usando NeDB en memoria, validando creación, búsqueda por `id` y actualización del campo `estado`.
- Las pruebas del repositorio usan opciones `{ inMemoryOnly: true }`, por lo que no tocan el archivo `data/collection.db`.
