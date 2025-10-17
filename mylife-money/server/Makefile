DIR_ROOT = $(shell realpath ../..)
DIR_UI = $(shell realpath ../ui)

DOCKER_REPOSITORY ?= vincenttr
DOCKER_PACKAGE_NAME ?= mylife-money
DOCKER_PACKAGE_VERSION ?= $(shell node -p "require('$(DIR_UI)/package.json').version")
DOCKER_IMAGE_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):$(DOCKER_PACKAGE_VERSION)
DOCKER_IMAGE_LATEST_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):latest

.PHONY: docker-publish docker-build build-ui

docker-publish: docker-build
	docker push "$(DOCKER_IMAGE_TAG)"
	docker push "$(DOCKER_IMAGE_LATEST_TAG)"

docker-build: build-ui
	docker build --pull -t "$(DOCKER_IMAGE_TAG)" -t "$(DOCKER_IMAGE_LATEST_TAG)" -f docker/Dockerfile $(DIR_ROOT)

build-ui:
	cd $(DIR_UI) && npm run ui-build:prod

run-web:
	go run main.go web
