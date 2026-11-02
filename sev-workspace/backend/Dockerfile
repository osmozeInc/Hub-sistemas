FROM php:8.4-cli-alpine

# Instala dependências do sistema e extensão do PostgreSQL
RUN apk add --no-cache postgresql-dev curl libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]