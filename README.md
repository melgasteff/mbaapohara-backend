# Mbaapohara — backend

API de una plataforma web donde trabajadores publican reseñas laborales anónimas y moderadas sobre empresas y
locales de Paraguay, y cualquier persona las consulta, filtra y ve indicadores agregados.

Proyecto Final de Grado, Ingeniería en Informática, FCyT-UNCA.

- **Stack:** NestJS 10 + TypeScript, PostgreSQL 16 + TypeORM 0.3, JWT, Swagger.
- **Documentación de la API:** `http://localhost:3000/docs` (Swagger), con la API en marcha.
- **Arquitectura:** [docs/arquitectura.md](docs/arquitectura.md).
- **Frontend:** Angular 22, en el repositorio vecino [mbaapohara-frontend](../mbaapohara-frontend/README.md),
  con los pasos para levantar la API y el frontend juntos y el guion de la demo.

## Requisitos

- **Con contenedores:** Docker con el plugin `compose` (o Podman con `podman compose`).
- **Sin contenedores:** Node.js 22 (`nvm use` toma la versión de `.nvmrc`) y PostgreSQL 16 con la extensión
  `unaccent` disponible (viene con el paquete estándar de PostgreSQL).

## Puesta en marcha

### 1. Variables de entorno

```bash
cp .env.example .env
```

Completar al menos `DB_PASS` y `JWT_SECRET` (generar con `openssl rand -base64 48`). La API valida las variables
al arrancar y no inicia si falta alguna o es inválida.

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` | Sí | Conexión a PostgreSQL |
| `CORS_ORIGINS` | Sí | Orígenes permitidos, separados por comas (por ejemplo `http://localhost:4200`) |
| `JWT_SECRET` | Sí | Secreto para firmar los tokens, al menos 32 caracteres |
| `JWT_EXPIRES_IN` | No | Vigencia del token de acceso (por defecto `2h`) |
| `ANTHROPIC_API_KEY` | No | Clave de la API de Claude para el clasificador de moderación. Sin ella, toda reseña va a revisión humana |
| `MODERATION_MODEL` | No | Modelo del clasificador (por defecto `claude-haiku-5-5`) |
| `MODERATION_MONTHLY_BUDGET_USD` | No | Tope de gasto mensual del clasificador (por defecto `5`) |
| `MODERATION_TIMEOUT_MS` | No | Tiempo máximo de cada llamada al modelo (por defecto `10000`) |
| `PORT` | No | Puerto de la API (por defecto `3000`) |
| `NODE_ENV` | No | `development` (por defecto), `production` o `test` |

### 2a. Con contenedores (un comando)

```bash
docker compose up --build
```

Levanta PostgreSQL y la API con recarga. Al arrancar, la API aplica las migraciones y carga los datos de
demostración. La API queda en `http://localhost:3000` y la base del contenedor en el puerto `5433` de la máquina.
Los datos persisten en el volumen `pgdata`; `docker compose down -v` los borra.

### 2b. Sin contenedores

```bash
npm install
npm run db:setup      # migraciones + datos de demostración, sobre la base de .env
npm run start:dev     # API con recarga
```

### 3. Primer administrador

```bash
npm run admin:create -- correo@ejemplo.com                         # sin contenedores
docker compose exec api npm run admin:create -- correo@ejemplo.com # con contenedores
```

Pide la contraseña por la terminal, sin mostrarla. Si la cuenta existe, la promueve a administrador.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run start:dev` | API con recarga |
| `npm run build` / `npm run start:prod` | Compila a `dist/` / arranca la versión compilada |
| `npm run db:setup` | Migraciones + datos de demostración |
| `npm run db:reset` | **Solo desarrollo:** borra el esquema y corre `db:setup` |
| `npm run seed` | Datos de demostración (idempotente; no corre en producción) |
| `npm run migration:run` / `migration:show` / `migration:revert` | Migraciones con TypeORM |
| `npm run migration:create --name=nombre` | Crea una migración vacía |
| `npm run admin:create -- correo` | Crea o promueve un administrador |
| `npm test` / `npm run test:e2e` | Pruebas unitarias / de punta a punta (ver «Pruebas») |
| `npm run lint` / `npm run format` | ESLint (corrige) / Prettier |

## Moderación

El módulo `moderation` aplica la [política de moderación](docs/politica-moderacion.md): reglas locales (datos de
contacto, lista de insultos, texto repetido), un clasificador con Claude vía API detrás del puerto `TextClassifier`
y la tabla de decisión (publicada, en revisión o rechazada). Cada decisión se registra en `decisiones_moderacion`
con la huella del texto, nunca el texto; el gasto del mes se lleva en `gasto_moderacion`.

- La clave `ANTHROPIC_API_KEY` se crea en la consola del proveedor de la API y se paga por uso. Sin clave, o al llegar al tope mensual, todo va a revisión humana.
- Al modelo solo se envía el texto de la reseña.
- Para probar un texto (administrador): `POST /moderation/evaluate` con `{ "loBueno": "...", "aMejorar": "..." }`;
  el gasto del mes: `GET /moderation/spend`.
- Revisión humana (administrador, 3.9a): `GET /moderation/queue` lista las versiones en revisión, la más antigua
  primero, con las señales de la moderación automática y sin el autor; `PATCH /moderation/queue/:idVersion/publish`
  y `PATCH /moderation/queue/:idVersion/reject` con `{ "categoria": "TER", "motivo": "..." }`. Cada decisión queda en
  el registro con origen `persona` y el administrador.
- Reportes (3.9b): `POST /reviews/:id/reports` (con sesión, una vez por cuenta, no las propias); el administrador ve
  `GET /moderation/reports` (agrupados por reseña, sin quién reportó ni el autor) y decide con
  `PATCH /moderation/reviews/:id/keep` o `PATCH /moderation/reviews/:id/retire` (`{ categoria, motivo }`).
- Solicitudes de empresas (3.9b): `POST /company-requests` es público (3 por hora por IP); el administrador las ve en
  `GET /moderation/company-requests` y registra la respuesta, enviada por correo a mano, con
  `PATCH /moderation/company-requests/:id/answer`: ahí se borran el nombre y el correo.
- Cargos propuestos desde una reseña: `GET /jobs/admin?estado=pendiente`, `PATCH /jobs/:id/approve` y
  `PATCH /jobs/:id/reject`.
- Criterios (3.8): `GET /criteria` es público (categorías activas con sus ítems activos, en orden). El administrador
  ve todo con `GET /criteria/admin` (con la cantidad de respuestas de cada ítem), crea con `POST /criteria/categories`
  y `POST /criteria/items`, y cambia texto, orden o `activo` con `PATCH /criteria/categories/:id` y
  `PATCH /criteria/items/:id`. El código no se cambia y no hay borrado.

## Pruebas

Las pruebas de punta a punta (`test/*.e2e-spec.ts`) levantan la API completa y la prueban por HTTP contra una
**base de datos aparte**, nunca la de desarrollo:

```bash
cp .env.test.example .env.test   # completar DB_PASS y JWT_SECRET; DB_NAME debe terminar en «_test»
npm run test:e2e
```

Cada corrida crea la base si no existe, borra su esquema y aplica las migraciones; si el nombre de la base no
termina en `_test`, se niega a seguir. Cubren autenticación y mi cuenta, el límite de intentos, los catálogos y
empresas y locales (propuesta, visibilidad, aprobación, rechazo, duplicados, búsqueda y baja), y la
administración de criterios (alta, edición, desactivación y duplicados).

## Datos

- **De referencia** (en la migración base): los 18 departamentos y 263 distritos del INE (Códigos geográficos
  2022, ver [docs/datos/catalogo-ine-2022.csv](docs/datos/catalogo-ine-2022.csv)), las 21 secciones de la
  CIIU Rev. 4 como rubros, tipos de contrato, modalidades y cargos iniciales.
- **De demostración** (`npm run seed`): criterios provisionales, empresas y locales de ejemplo. No se cargan en
  producción. Los criterios se cargan solo si no hay ninguna categoría; después se administran desde la API (3.8).

## Estructura

```
src/
  auth/         autenticación, roles y «mi cuenta» (módulo completo: domain, application, infrastructure, presentation)
  users/        tabla usuarios y administración de cuentas (módulo liviano)
  catalogs/     departamentos, ciudades, cargos, rubros, tipos de contrato, modalidades (liviano)
  companies/    empresas y locales, con propuesta y aprobación (liviano)
  moderation/   clasificador de moderación: reglas, modelo de lenguaje, decisión y registro (completo)
  company-requests/  solicitudes de empresas: formulario público y bandeja (liviano)
  reviews/      reseñas: publicar, editar, borrar y consultar con filtros, con la moderación integrada (completo)
  criteria/     criterios de la reseña: categorías e ítems, con alta, edición y desactivación (liviano)
  shared/       configuración, base de datos, paginación y filtro de errores
docs/           plan, arquitectura, decisiones y datos de referencia
```

Toda ruta exige un token (`Authorization: Bearer <token>`) salvo las marcadas como públicas; las acciones de
administración exigen el rol `administrador`. Ver [docs/arquitectura.md](docs/arquitectura.md).

## Despliegue

El `Dockerfile` tiene una etapa `prod` que compila la API, aplica las migraciones pendientes al arrancar y
corre sin el código fuente ni los datos de demostración:

```bash
docker build --target prod -t mbaapohara-api .
```

Las variables de entorno las define la plataforma de despliegue (tarea 4.4).
