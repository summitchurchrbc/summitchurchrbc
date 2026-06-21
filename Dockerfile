FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
CMD sh -c "sed -i \"s/listen 80/listen ${PORT:-80}/\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"# Force live-checker rebuild - Sun Jun 21 06:30:49 PM UTC 2026
