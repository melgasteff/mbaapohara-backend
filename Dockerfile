# syntax=docker/dockerfile:1
# Imagen de la API. Etapas: deps (dependencias) -> dev (Compose de desarrollo) / build -> prod (despliegue).

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- desarrollo: el código se monta como volumen y Nest recarga al guardar
FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "npm run db:setup && npm run start:dev"]

# ---------- compilación: dist/ y solo las dependencias de producción
FROM deps AS build
COPY . .
RUN npm run build && npm prune --omit=dev

# ---------- producción: sin código fuente ni semilla de demostración
FROM node:22-bookworm-slim AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
# Aplica las migraciones pendientes y arranca. Las variables de entorno las pone la plataforma de despliegue.
CMD ["sh", "-c", "npm run migration:run:prod && node dist/main"]
