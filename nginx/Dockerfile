FROM nginx:alpine
RUN apk add --no-cache openssl

# Crear directorios para certificados
RUN mkdir -p /etc/nginx/ssl

# Generar claves y certificados autofirmados
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/localhost.key -out /etc/nginx/ssl/localhost.crt -subj "/CN=localhost"

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
