# Stage 1: Install dependencies
FROM composer:2 as vendor

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install --no-dev --no-interaction --no-plugins --no-scripts --prefer-dist

# Stage 2: Build application
FROM php:8.2-fpm

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql zip gd mbstring exif pcntl bcmath opcache

# Copy application code
COPY . .

# Copy vendor dependencies
COPY --from=vendor /app/vendor/ ./vendor/

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
