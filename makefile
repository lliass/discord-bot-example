# Docker variables
COMPOSE_FILE_PATH= docker-compose.yaml
COMPOSE_SERVICE_NAME = moni-thor-bot-container
COMPOSE_PROJECT_NAME = monithor


# Install projects dependencies
install:
	rm -rf node_modules || true && rm package-lock.json || true && npm i

# Set optional docker environment
up:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) up --detach
clean-up:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) up --detach --build --force-recreate --always-recreate-deps
down:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) down
clean-down:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) down --rmi all --volumes --remove-orphans

rebuild:
	make down && make up

sh:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) exec --privileged $(COMPOSE_SERVICE_NAME) bash
bash:
	docker-compose --file $(COMPOSE_FILE_PATH) --project-name $(COMPOSE_PROJECT_NAME) exec --privileged $(COMPOSE_SERVICE_NAME) bash