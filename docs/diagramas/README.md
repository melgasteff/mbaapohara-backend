# Diagramas del sistema (tarea 4.5)

Fuente en Mermaid (`.mmd`, texto versionado) e imágenes exportadas en `svg/` (vectorial, para LaTeX o la web) y
`png/` (alta resolución, para Word o Google Docs). Describen el código **tal como está el 21/11/2026**.

| Anexo | Diagrama | Archivo | Qué muestra |
| --- | --- | --- | --- |
| C | Casos de uso: público | `casos-de-uso-publico` | Visitante, trabajador registrado, persona de una empresa y servicio de moderación, con el requisito de cada caso (RF1 a RF7, RNF). Borde punteado: pendiente (3.6 y 3.7) |
| C | Casos de uso: administración | `casos-de-uso-administracion` | El administrador, que también modera (D5). «solo API»: sin pantalla todavía |
| D | Entidad-relación | `er` | Las 18 tablas que dejan las migraciones, con claves, relaciones, restricciones `UNIQUE` y `CHECK` |
| D | Módulos | `modulos` | Los 8 módulos y sus dependencias; módulos completos y livianos (`docs/arquitectura.md`) |
| D | Clases: reseñas | `clases-reviews` | Dominio, puertos, casos de uso y adaptadores del módulo `reviews` |
| D | Clases: moderación | `clases-moderation` | `ModerationPort`, reglas, clasificador, tabla de decisión y medición (2.4) |
| D | Clases: autenticación | `clases-auth` | Puertos, casos de uso, adaptadores y los dos guards globales |

## Convenciones

- **Casos de uso:** Mermaid no tiene ese tipo de diagrama. Los actores son círculos y los casos, óvalos dentro del
  sistema; «incluye» y «extiende» van con línea punteada, como en UML.
- **Entidad-relación:** notación de pata de gallo. `int` = integer, `varchar` = character varying, `ts` = timestamp
  with time zone. Tipos enumerados de la base:

  | Tipo | Valores |
  | --- | --- |
  | `estado_propuesta` | pendiente, aprobada, rechazada |
  | `estado_resena` | en_revision, publicada, rechazada |
  | `situacion_laboral` | actual, anterior |
  | `respuesta_criterio` | si, en_parte, no, no_sabe |
  | `estado_reporte` | pendiente, mantenida, retirada |
  | `estado_solicitud` | pendiente, respondida |
  | `tipo_solicitud` | revision_resena, correccion_datos |
  | `rol_usuario` | usuario, administrador |
  | `estado_cuenta` | activo, bloqueado |

- **Clases:** las clases abstractas marcadas «puerto» son los contratos del dominio; los «adaptadores» los
  implementan con una tecnología concreta (SQL, TypeORM, bcrypt, JWT, Claude). Flecha punteada: «usa»; flecha con
  triángulo: «implementa». Los métodos asíncronos devuelven una promesa del tipo indicado.

## Cómo actualizarlos

1. Editar el `.mmd` (se puede previsualizar en GitHub o en https://mermaid.live).
2. Exportar: `bash docs/diagramas/exportar.sh` (todos) o `bash docs/diagramas/exportar.sh er` (uno). Usa
   `@mermaid-js/mermaid-cli` con el Google Chrome instalado (`puppeteer.json`); si Chrome está en otra ruta, cambiarla
   ahí.
3. El entidad-relación se armó con el esquema de la base de pruebas, que `npm run test:e2e` reconstruye con las
   migraciones. Si una migración nueva cambia el esquema, compararlo con
   `psql -d mbaapohara_test -c '\d nombre_de_la_tabla'`.
