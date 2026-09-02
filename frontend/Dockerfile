# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_API_URL is baked in at build time since this is a static SPA build.
# Override with --build-arg for a different backend URL.
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

# The official nginx image's master process starts as root only to bind
# to port 80; its worker processes (which handle all actual requests)
# already run as the unprivileged "nginx" user by default. This is the
# standard, portable way to serve on port 80 without requiring the
# NET_BIND_SERVICE capability at the container/orchestrator level, which
# isn't guaranteed to be available on every Kubernetes/EKS setup.
RUN rm -f /etc/nginx/conf.d/default.conf

COPY --from=builder /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O- http://127.0.0.1:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
