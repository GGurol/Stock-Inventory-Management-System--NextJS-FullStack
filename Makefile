# Makefile
include .env

up:
	@echo "APP_ENV is set to: $(APP_ENV)"
ifeq ($(APP_ENV), development)
	@echo "Starting in DEVELOPMENT mode..."
	# Use both the base file and the new dev file
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
else
ifeq ($(APP_ENV), production)
	@echo "Starting in PRODUCTION mode..."
	# Use ONLY the base file for a clean production build
	docker compose -f docker-compose.yml up --build -d
else
	@echo "APP_ENV is not set to 'development' or 'production'. Doing nothing."
endif
endif

down:
	docker compose down

logs:
	docker compose logs -f app