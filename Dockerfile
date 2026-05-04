FROM node:22-alpine AS builder

RUN apk add --no-cache curl make && \
    curl -fsSL https://d2lang.com/install.sh | sh

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM caddy:2-alpine

COPY Caddyfile.prod /etc/caddy/Caddyfile
COPY --from=builder /app/dist /srv

EXPOSE 80
