.DEFAULT_GOAL := help
.PHONY: help test

DOCKER_STAGE ?= development
INTERACTIVE := $(shell [ -t 0 ] && echo i || echo d)
APPDIR = /usr/dev
PWD=$(shell pwd)
SERVER_PORT=8014
SERVER_PORT_DEBUG=18014
CONTAINER_NAME=task-api
DOCKER_DATE_TAG=$(shell date +%Y-%m)

welcome:
	@echo "Welcome to ${CONTAINER_NAME}"

setup: welcome build-docker-image ## Install dependencies
ifeq ("$(wildcard ./env)","")
	@cp .env.default .env
endif

check-if-docker-image-exists:
ifeq ($(shell docker images -q dev/${CONTAINER_NAME}:date-${DOCKER_DATE_TAG} 2> /dev/null | wc -l),0)
	@echo "Docker image not found, building Docker image first"; sleep 2;
	@make build-docker-image
endif

build-docker-image:
	@echo "Building docker image from Dockerfile"
	@docker build --force-rm . --target ${DOCKER_STAGE} -t dev/${CONTAINER_NAME}:latest -t dev/${CONTAINER_NAME}:date-${DOCKER_DATE_TAG}

start: welcome check-if-docker-image-exists ## Start the Server for development purporses
	@echo 'Running on http://localhost:$(SERVER_PORT)'
	@docker run -t${INTERACTIVE} --rm -v ${PWD}:${APPDIR}:delegated --env-file=.env -p $(SERVER_PORT):80 -p $(SERVER_PORT_DEBUG):5858 -e USER_PERM=$(shell id -u):$(shell id -g) --name ${CONTAINER_NAME} dev/${CONTAINER_NAME}:latest

stop: ## Stop the Server
	@docker stop ${CONTAINER_NAME}

restart: ## Restart the Server
	@make stop
	@make start

start-database:
	@echo 'Running database server'
	@docker run --name mysql -d --env-file=.env.mysql -p 3307:3306  --restart unless-stopped  mysql:8

help: welcome
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep ^help -v | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
