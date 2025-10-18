DIR_ROOT = $(shell realpath ..)
DIR_UI = $(shell realpath ui)
DIR_SERVER = $(shell realpath server)

DOCKER_REPOSITORY ?= vincenttr
DOCKER_PACKAGE_NAME ?= mylife-money
DOCKER_PACKAGE_VERSION ?= $(shell node -p "require('$(DIR_UI)/package.json').version")
DOCKER_IMAGE_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):$(DOCKER_PACKAGE_VERSION)
DOCKER_IMAGE_LATEST_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):latest

.PHONY: docker-publish docker-build ui-build ui-watch ui-watch-tsc ui-lint run-web

docker-publish: docker-build
	docker push "$(DOCKER_IMAGE_TAG)"
	docker push "$(DOCKER_IMAGE_LATEST_TAG)"

docker-build: ui-build
	docker build --pull -t "$(DOCKER_IMAGE_TAG)" -t "$(DOCKER_IMAGE_LATEST_TAG)" -f docker/Dockerfile $(DIR_ROOT)

ui-build:
	cd $(DIR_UI) && npm run build:prod

ui-watch:
	cd $(DIR_UI) && npm run vite:watch

ui-watch-tsc:
	cd $(DIR_UI) && npm run tsc:watch

run-web:
	cd $(DIR_SERVER) && go run main.go web
