# Use official MySQL image as base
FROM mysql:8.0

# Set root password and database name (can be overridden by docker-compose)
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=boa_searchengine_d1

# Copy your SQL files into the initialization directory
# These scripts will automatically run in order when the container starts
COPY ./create-database.sql /docker-entrypoint-initdb.d/01-create-database.sql
COPY ./create-tables.sql /docker-entrypoint-initdb.d/02-create-tables.sql
COPY ./seeders.sql /docker-entrypoint-initdb.d/03-seeders.sql

# Expose MySQL port
EXPOSE 3306
