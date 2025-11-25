DIR_ROOT = $(shell realpath ..)
DIR_UI = $(shell realpath ui)
DIR_SERVER = $(shell realpath server)
DIR_COMMON_UI = $(DIR_ROOT)/common/ui

DOCKER_REPOSITORY ?= vincenttr
DOCKER_PACKAGE_NAME ?= mylife-money
DOCKER_PACKAGE_VERSION ?= $(shell node -p "require('$(DIR_UI)/package.json').version")
DOCKER_IMAGE_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):$(DOCKER_PACKAGE_VERSION)
DOCKER_IMAGE_LATEST_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):latest

.PHONY: docker-publish docker-build server-build ui-build ui-watch ui-watch-tsc ui-lint ui-lint-fix ui-format run-web

docker-publish: docker-build
	docker push "$(DOCKER_IMAGE_TAG)"
	docker push "$(DOCKER_IMAGE_LATEST_TAG)"

docker-build: ui-build
	docker build --pull -t "$(DOCKER_IMAGE_TAG)" -t "$(DOCKER_IMAGE_LATEST_TAG)" -f docker/Dockerfile $(DIR_ROOT)

server-build:
	cd $(DIR_SERVER) && go build -o ../dist/mylife-money-server main.go

ui-build:
	cd $(DIR_UI) && \
	npm run lint && \
	npm run format:check && \
	npm exec -- tsc --project public/tsconfig.json && \
	npm exec -- vite --config ../../common/ui/mylife-tools-build/vite.config.ts build

ui-watch:
	export VITE_WEB_PORT=8003; \
	export VITE_WSTARGET_PORT=8103; \
	cd $(DIR_UI) && \
	npm exec -- vite --config ../../common/ui/mylife-tools-build/vite.config.ts

ui-watch-tsc:
	cd $(DIR_UI) && \
	npm exec -- tsc --project public/tsconfig.json --watch

ui-lint:
	cd $(DIR_UI) && npm run lint
	cd $(DIR_COMMON_UI)/mylife-tools-ui && npm run lint
	cd $(DIR_COMMON_UI)/mylife-tools-common && npm run lint

ui-lint-fix:
	cd $(DIR_UI) && npm run lint:fix
	cd $(DIR_COMMON_UI)/mylife-tools-ui && npm run lint:fix
	cd $(DIR_COMMON_UI)/mylife-tools-common && npm run lint:fix

ui-format:
	cd $(DIR_UI) && npm run format
	cd $(DIR_COMMON_UI)/mylife-tools-ui && npm run format
	cd $(DIR_COMMON_UI)/mylife-tools-common && npm run format

run-web:
	cd $(DIR_SERVER) && go run main.go web
