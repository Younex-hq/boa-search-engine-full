# Use the official PHP CLI image (sufficient to run artisan serve)
FROM php:8.2-cli

# Install system dependencies & PHP extensions required by Laravel
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libonig-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libicu-dev \
    default-mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql mbstring bcmath zip intl opcache \
    && rm -rf /var/lib/apt/lists/*

# Install composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first for cacheable installs
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --prefer-dist --no-plugins --no-scripts -q \
  || composer install --no-interaction --no-scripts

# Copy the rest of the application
COPY . .

# Ensure storage & bootstrap cache dirs exist and are writable
RUN mkdir -p storage/framework storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 0775 storage bootstrap/cache

# Expose API port
EXPOSE 8800

# Generate APP_KEY at container start if missing and run artisan serve
# (The entrypoint handles key generation & optional migrations)
ENTRYPOINT ["sh", "-c", "\
  if [ -f .env ]; then \
    php -r \"file_exists('.env') || copy('.env.example', '.env');\"; \
  fi; \
  php artisan key:generate --ansi --force || true; \
  php artisan migrate --force || true; \
  php artisan serve --host=0.0.0.0 --port=8800 --no-reload"]
