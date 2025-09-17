APP_ENV ?= development

up:
ifeq ($(APP_ENV),development)
	docker compose up
else ifeq ($(APP_ENV),production)
	docker compose -f docker-compose.yml up --build
endif

down:
	docker compose down

logs:
	docker compose logs -f app
