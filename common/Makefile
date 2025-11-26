DIR_ROOT = $(shell realpath ..)
DIR_UI = $(shell realpath ui)

DIR_TOOLS_UI = $(DIR_UI)/mylife-tools-ui
DIR_TOOLS_COMMON = $(DIR_UI)/mylife-tools-common

.PHONY: lint lint-fix format format-check typecheck

lint:
	cd $(DIR_TOOLS_UI) && npm exec -- eslint --config ../../.eslintrc.json --ignore-path ../../.eslintignore . --ext .js,.jsx,.ts,.tsx
	cd $(DIR_TOOLS_COMMON) && npm exec -- eslint --config ../../.eslintrc.json --ignore-path ../../.eslintignore . --ext .js,.jsx,.ts,.tsx

lint-fix:
	cd $(DIR_TOOLS_UI) && npm exec -- eslint --config ../../.eslintrc.json --ignore-path ../../.eslintignore . --ext .js,.jsx,.ts,.tsx --fix
	cd $(DIR_TOOLS_COMMON) && npm exec -- eslint --config ../../.eslintrc.json --ignore-path ../../.eslintignore . --ext .js,.jsx,.ts,.tsx --fix

format:
	cd $(DIR_TOOLS_UI) && npm exec -- prettier --write --config ../../.prettierrc --ignore-path ../../.prettierignore "**/*.{js,jsx,ts,tsx}"
	cd $(DIR_TOOLS_COMMON) && npm exec -- prettier --write --config ../../.prettierrc --ignore-path ../../.prettierignore "**/*.{js,jsx,ts,tsx}"

format-check:
	cd $(DIR_TOOLS_UI) && npm exec -- prettier --check --config ../../.prettierrc --ignore-path ../../.prettierignore "**/*.{js,jsx,ts,tsx}"
	cd $(DIR_TOOLS_COMMON) && npm exec -- prettier --check --config ../../.prettierrc --ignore-path ../../.prettierignore "**/*.{js,jsx,ts,tsx}"

typecheck:
	cd $(DIR_TOOLS_UI) && npm exec -- tsc --noEmit
	cd $(DIR_TOOLS_COMMON) && npm exec -- tsc --noEmit
