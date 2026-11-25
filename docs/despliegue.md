# Despliegue (tarea 4.4)

Neon (PostgreSQL) + Render (API, con el `Dockerfile`) + Vercel (frontend). Todo en planes gratuitos.
Las claves se cargan en los paneles o en `.env.production.local`, que Git y Docker ignoran. Nunca van en el repositorio.

## 1. Base: Neon

1. Crear un proyecto con PostgreSQL 16, en una región cercana a la de Render (`virginia`, es decir, AWS `us-east-1`).
2. Copiar los datos de la conexión **directa** (sin *pooler*): servidor, usuario, contraseña y base.
3. En la PC, crear `.env.production.local` (valores entre comillas simples):

```bash
NODE_ENV='production'
DB_HOST='…'
DB_PORT='5432'
DB_USER='…'
DB_PASS='…'
DB_NAME='…'
DB_SSL='true'
```

4. Preparar la base. Los paréntesis hacen que las variables no queden en la terminal:

```bash
chmod 600 .env.production.local
( set -a; . ./.env.production.local; set +a; npm run migration:run && npm run seed:criteria )
( set -a; . ./.env.production.local; set +a; npm run admin:create -- correo@ejemplo.com )
```

`seed:criteria` muestra la base y el servidor antes de escribir, y no toca criterios ya cargados. **Nunca** correr
`db:reset` ni las pruebas con estas variables. Las empresas se cargan después desde `/admin`.

## 2. Código en GitHub

Render y Vercel leen los repositorios públicos: las ramas con esta tarea tienen que estar publicadas.

## 3. API: Render

1. *New → Blueprint*, repositorio del backend. Render lee `render.yaml`, con la rama `develop/steff`.
2. Completar los valores que pide: los `DB_*` de Neon, `ANTHROPIC_API_KEY` y `CORS_ORIGINS`. Como todavía no existe la
   dirección de Vercel, poner `http://localhost:4200` y cambiarla en el paso 4.
3. Comprobar que `https://<servicio>.onrender.com/criteria` devuelve 3 categorías con 23 criterios.
   `JWT_SECRET` lo genera Render.

## 4. Frontend: Vercel

1. Poner la dirección de la API en `src/environments/environment.ts` del frontend (hoy, `/api`) y publicar ese cambio.
   Usar solo la dirección que muestra Render: a ese servidor se envían las contraseñas.
2. *Add New → Project*, repositorio del frontend. `vercel.json` ya trae la compilación y las rutas.
3. En Render, cambiar `CORS_ORIGINS` por la dirección de Vercel, sin barra final, y volver a desplegar.
4. Recargar `/empresas` y `/como-moderamos`: no tienen que dar 404.

## 5. Medir los proxies de confianza

Con `TRUST_PROXY_HOPS=0` todas las personas comparten el límite de intentos. Probar 1, después 2 y así, con este pedido:

```bash
API=https://<servicio>.onrender.com
for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w '%{http_code} ' -X POST "$API/auth/login" \
  -H "X-Forwarded-For: 203.0.113.$i" -H 'content-type: application/json' \
  -d '{"email":"nadie@ejemplo.com","password":"x"}'; done; echo
```

- El sexto tiene que dar **429**. Si da 401, el valor es demasiado alto: se puede falsificar la IP.
- Enseguida, repetirlo desde otra red (datos del celular): el primero tiene que dar **401**. Si da 429, el valor es bajo.
- Queda el valor que cumple las dos cosas. Esperar un minuto entre pruebas.

## 6. Verificación

- [ ] El sitio y la API responden por HTTPS.
- [ ] Registro, ingreso, propuesta de empresa y aprobación desde `/admin`.
- [ ] `GET /moderation/spend` (administrador): `conClave` es `true`.
- [ ] Una reseña ficticia se publica y otra con un teléfono se rechaza o va a revisión.
- [ ] Alojamiento y copias de seguridad completados en la página de privacidad.

## Límites de los planes gratuitos

Render duerme el servicio a los 15 minutos sin uso y tarda cerca de un minuto en despertar: abrirlo antes de una demostración.
Neon da 1 GB y 100 horas de cómputo por mes, y suspende la base a los 5 minutos sin uso (consultado el 25/11/2026).
