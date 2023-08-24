#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE ROLE postgres LOGIN SUPERUSER;
    ALTER ROLE postgres WITH PASSWORD 'Smallville98';
    CREATE DATABASE dev;
	GRANT ALL PRIVILEGES ON DATABASE dev TO postgres;
EOSQL