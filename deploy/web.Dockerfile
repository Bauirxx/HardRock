# ─── Frontend + Caddy (serve o site + reverse proxy + HTTPS) ───
# Contexto de build: a raiz do projeto (onde está o package.json).

# Etapa 1 — compilar o React (Vite → dist/)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2 — Caddy serve os ficheiros estáticos + reverse proxy + HTTPS automático
FROM caddy:2-alpine
COPY --from=build /app/dist /srv
COPY deploy/Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443
