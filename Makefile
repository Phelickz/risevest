# app name should be overridden.
# ex) production-stage: make build APP_NAME=<APP_NAME>
# ex) development-stage: make build-dev APP_NAME=<APP_NAME>

APP_NAME = risevest
APP_NAME := $(APP_NAME)

# Build the container image - Dvelopment  cd paintastic-api && npm run migrate

dev:
	docker compose -f docker-compose-d.yml up -d postgres
	docker compose -f docker-compose-d.yml up
