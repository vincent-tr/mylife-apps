DIR_ROOT = $(shell realpath ..)
DIR_UI = $(shell realpath ui)
DIR_SERVER = $(shell realpath server)
DIR_COMMON = $(DIR_ROOT)/common

DOCKER_REPOSITORY ?= vincenttr
DOCKER_PACKAGE_NAME ?= mylife-money
DOCKER_PACKAGE_VERSION ?= $(shell node -p "require('$(DIR_UI)/package.json').version")
DOCKER_IMAGE_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):$(DOCKER_PACKAGE_VERSION)
DOCKER_IMAGE_LATEST_TAG ?= $(DOCKER_REPOSITORY)/$(DOCKER_PACKAGE_NAME):latest

.PHONY: docker-publish docker-build server-build ui-build ui-watch ui-watch-tsc ui-lint ui-lint-fix ui-format ui-format-check ui-typecheck ui-common-lint ui-common-lint-fix ui-common-format ui-common-format-check ui-common-typecheck

docker-publish: docker-build
	docker push "$(DOCKER_IMAGE_TAG)"
	docker push "$(DOCKER_IMAGE_LATEST_TAG)"

docker-build: ui-build
	docker build --pull -t "$(DOCKER_IMAGE_TAG)" -t "$(DOCKER_IMAGE_LATEST_TAG)" -f docker/Dockerfile $(DIR_ROOT)

server-build:
	cd $(DIR_SERVER) && go build -o ../dist/mylife-money-server main.go

ui-build: ui-lint ui-format-check ui-typecheck
	cd $(DIR_UI) && npm exec -- vite --config ../../common/ui/build/vite.config.ts build

ui-watch:
	export VITE_WEB_PORT=8003; \
	export VITE_WSTARGET_PORT=8103; \
	cd $(DIR_UI) && \
	npm exec -- vite --config ../../common/ui/build/vite.config.ts

ui-watch-tsc:
	cd $(DIR_UI) && \
	npm exec -- tsc --project tsconfig.json --watch

ui-lint: ui-common-lint
	cd $(DIR_UI) && npm exec -- eslint --config ../../.eslintrc.json --ignore-path ../../.eslintignore . --ext .js,.jsx,.ts,.tsx

ui-lint-fix: ui-common-lint-fix
	cd $(DIR_UI) && npm exec -- eslint --config ../../.eslintrc.json --ignore-path ../../.eslintignore . --ext .js,.jsx,.ts,.tsx --fix

ui-format: ui-common-format
	cd $(DIR_UI) && npm exec -- prettier --write --config ../../.prettierrc --ignore-path ../../.prettierignore "**/*.{js,jsx,ts,tsx}"

ui-format-check: ui-common-format-check
	cd $(DIR_UI) && npm exec -- prettier --check --config ../../.prettierrc --ignore-path ../../.prettierignore "**/*.{js,jsx,ts,tsx}"

ui-typecheck: ui-common-typecheck
	cd $(DIR_UI) && npm exec -- tsc --project tsconfig.json --noEmit

ui-common-lint:
	$(MAKE) -C $(DIR_COMMON) ui-lint

ui-common-lint-fix:
	$(MAKE) -C $(DIR_COMMON) ui-lint-fix

ui-common-format:
	$(MAKE) -C $(DIR_COMMON) ui-format

ui-common-format-check:
	$(MAKE) -C $(DIR_COMMON) ui-format-check

ui-common-typecheck:
	$(MAKE) -C $(DIR_COMMON) ui-typecheck

run-web:
	cd $(DIR_SERVER) && go run main.go web
