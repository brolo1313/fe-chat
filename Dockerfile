# Dockerfile for production build

# ====== STAGE 1 — Build Angular ======
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:prod

# ====== STAGE 2 — Serve with Nginx ======
FROM nginx:1.25-alpine

COPY --from=builder /app/dist/fe-chat/browser /usr/share/nginx/html

# Можна додати кастомний nginx.conf якщо потрібно
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]