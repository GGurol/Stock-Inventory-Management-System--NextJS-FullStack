# Makefile
export $(shell sed 's/=.*//' .env)

up:
ifeq ($(APP_ENV),development)
	docker compose up -d
else ifeq ($(APP_ENV),production)
	docker compose -f docker-compose.yml -f docker-compose.override.yml up --build -d
endif

down:
	docker compose down

logs:
	docker compose logs -f app
