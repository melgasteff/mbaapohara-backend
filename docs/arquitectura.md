# Arquitectura del backend

Estructura objetivo y convenciones (tarea 1.1). Se aplican a cada módulo cuando una tarea del plan lo
reescribe; el código que no se toca queda como está. Fuente: `docs/PLAN(1).md`, sección 1.2.

## Dos estilos de módulo

Las capas se aplican según haya reglas de negocio que proteger, no en todos los módulos por igual.

### Completo: `auth`, `reviews`, `moderation`

Tienen reglas de negocio y dependencias que se pueden sustituir (proveedor de PLN, hashing, repositorios).

```
src/reviews/
  domain/
    model/            entidades de dominio: clases sin decoradores de Nest ni de TypeORM
    port/             interfaces que el dominio necesita (ModerationPort, ReviewRepository…)
  application/
    use-case/         un caso de uso por clase, con execute()
    exception/        excepciones de negocio
  infrastructure/
    typeorm/          entidades @Entity y adaptadores de los puertos
    module/           módulo de Nest y registro de providers
  presentation/
    *.controller.ts
    dto/              entrada (con class-validator) y respuesta, en clases separadas
```

- Los puertos son clases abstractas, que sirven a la vez como contrato y como token de inyección.
- Los casos de uso reciben sus puertos por constructor y no importan nada de `infrastructure/`.

### Liviano: `catalogs`, `companies`, `criteria`, `users`, `insights`

Son CRUD o consultas sin reglas propias.

```
src/companies/
  companies.module.ts
  companies.controller.ts
  companies.service.ts
  entities/           entidades @Entity (una por tabla)
  dto/                entrada y respuesta
```

- El servicio usa `Repository<Entidad>` de TypeORM directamente: sin entidades de dominio, mappers de
  tres niveles ni un caso de uso por operación.
- Si un submódulo crece (por ejemplo, locales dentro de `companies`), va en una subcarpeta con su
  controlador, servicio, entidad y DTO.

## De los módulos actuales a los 8 finales

| Módulo final | Estilo | Viene de | Tarea |
| --- | --- | --- | --- |
| `catalogs` | Liviano | `cities`, `jobs`, tabla `tipo_contrato`; `countries` se elimina | 1.3 (hecha) |
| `companies` | Liviano | `companies` + `offices` | 1.4 |
| `auth` | Completo | `session-manager` + registro de `users` | 1.5 |
| `users` | Liviano | `users` | 1.5 |
| `criteria` | Liviano | `categories` + `items` (los motivos se eliminaron en la 1.1, R4) | Fase 3 |
| `reviews` | Completo | `evaluations` | Fase 3 |
| `moderation` | Completo | Nuevo | 2.3 |
| `insights` | Liviano | Nuevo | Fase 3 |

`categories` e `items` funcionan y no cambian por ahora: se mueven a su módulo final solo cuando
una tarea los modifique.

## Reglas entre módulos

1. **Una entidad TypeORM por tabla**, en el módulo dueño de la tabla. Hoy `empresas` y `usuarios` tienen
   tres copias; al reescribir un módulo, sus copias en otros módulos se eliminan.
2. **Otro módulo que necesite esos datos importa el módulo dueño** y usa el servicio que exporta. Nunca
   registra la entidad ajena con `forFeature` ni redefine el modelo.
3. **Los módulos completos no dependen de los livianos directamente.** Por ejemplo, `reviews` define un
   puerto (`OfficeLookupPort`) y el adaptador llama al servicio de `companies`. Así el dominio de la reseña
   no conoce TypeORM.
4. **Las referencias entre módulos se hacen por id.** Una reseña guarda `idLocal` y `idCargo`; no copia la
   empresa ni el cargo a su propio dominio.
5. **`src/shared/`** guarda solo lo que de verdad es transversal:
   - `shared/domain/`: tipos usados por más de un módulo completo (por ejemplo, el rol del usuario). Se crea
     con el primer tipo que lo necesite.
   - `shared/infrastructure/`: base de datos, migraciones y, desde la 1.2, paginación, configuración y filtro
     de errores.
6. **No hay casos de uso `count` sueltos.** Desde la 1.2, todo listado devuelve `{ data, total, page, pageSize }`
   con una sola consulta (`findAndCount`), en lugar de `ResponseModel` (`{ count, data }`).
7. **Los duplicados se validan con restricciones `UNIQUE` y una consulta**, nunca cargando la tabla entera en memoria.

## Convenciones

- Archivos en kebab-case: `get-all.use-case.ts`, `companies.service.ts`, `create-company.dto.ts`.
- Nombres de dominio, tablas y columnas en español (`descripcion`, `id_ciudad`); código de infraestructura
  (Repository, Service, Controller) en inglés, como hasta ahora.
- Imports absolutos con `src/...`.
- DTO de entrada y DTO de respuesta separados: la respuesta nunca incluye la contraseña ni el autor de una reseña.
- Todo cambio de esquema necesita una migración (`synchronize: false`).
