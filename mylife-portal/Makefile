DIR_ROOT = $(shell realpath ..)
DIR_UI = $(shell realpath ui)
DIR_SERVER = $(shell realpath server)

DOCKER_REPOSITORY ?= vincenttr
DOCKER_PACKAGE_NAME ?= mylife-portal
DOCKER_PACKAGE_VERSION ?= $(shell node -p "require('$(DIR_UI)/package.json').version")
DOCKER_IMAGE_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):$(DOCKER_PACKAGE_VERSION)
DOCKER_IMAGE_LATEST_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):latest

.PHONY: docker-publish docker-build server-build ui-build ui-watch ui-watch-tsc ui-lint run-web

docker-publish: docker-build
	docker push "$(DOCKER_IMAGE_TAG)"
	docker push "$(DOCKER_IMAGE_LATEST_TAG)"

docker-build: ui-build
	docker build --pull -t "$(DOCKER_IMAGE_TAG)" -t "$(DOCKER_IMAGE_LATEST_TAG)" -f docker/Dockerfile $(DIR_ROOT)

server-build:
	cd $(DIR_SERVER) && go build -o ../dist/mylife-portal-server main.go

ui-build:
	cd $(DIR_UI) && \
	rm -rf dist/prod/static && \
	install -d dist/prod/static/bootstrap/css && \
	install -d dist/prod/static/bootstrap/fonts && \
	install public/* dist/prod/static && \
	install ../../node_modules/bootstrap/dist/css/bootstrap.min.css dist/prod/static/bootstrap/css && \
	install ../../node_modules/bootstrap/dist/fonts/* dist/prod/static/bootstrap/fonts

run-web:
	export WEB_PORT=8080; \
	cd $(DIR_SERVER) && \
	go run main.go web
