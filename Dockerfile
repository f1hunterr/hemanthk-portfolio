# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .
# nginx serves the site at the root, not under the GitHub Pages sub-path
ENV VITE_BASE_PATH=/
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
