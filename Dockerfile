FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_STORAGE_BASE_URL
ARG VITE_API_TIMEOUT_MS
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_STORAGE_BASE_URL=$VITE_STORAGE_BASE_URL
ENV VITE_API_TIMEOUT_MS=$VITE_API_TIMEOUT_MS

RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY production.mjs ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q http://localhost:3000/ -O /dev/null || exit 1

CMD ["node", "production.mjs"]
