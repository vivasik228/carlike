FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS build
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_METRIKA_ID
ARG NEXT_PUBLIC_YANDEX_VERIFICATION
ARG NEXT_PUBLIC_MAP_EMBED_URL
ARG LEGAL_OPERATOR
ARG LEGAL_INN
ARG LEGAL_OGRN
ARG LEGAL_ADDRESS
ARG LEGAL_EMAIL
ARG LEGAL_RETENTION
ARG LEGAL_APPROVED=false
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
RUN mkdir -p /var/lib/carlike && chown node:node /var/lib/carlike
USER node
EXPOSE 3000
CMD ["node","server.js"]
