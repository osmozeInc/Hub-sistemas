FROM php:8.4-cli-alpine

# Instala dependências do sistema e extensão do PostgreSQL
RUN apk add --no-cache postgresql-dev curl libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 1. Copia todo o código do seu backend para dentro do contêiner
COPY . .

# 2. Instala as dependências do Laravel ignorando pacotes de desenvolvimento
RUN composer install --no-dev --optimize-autoloader

# 3. O Cloud Run fornece a porta pela variável $PORT. 
# Usamos a sintaxe de shell (sem colchetes) para ler a variável.
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
