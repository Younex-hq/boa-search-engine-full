FROM mysql:8.0

COPY create-database.sql /docker-entrypoint-initdb.d/1-create-database.sql
COPY create-tables.sql /docker-entrypoint-initdb.d/2-create-tables.sql
COPY seeders.sql /docker-entrypoint-initdb.d/3-seeders.sql
