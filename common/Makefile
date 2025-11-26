DIR_ROOT = $(shell realpath ..)
DIR_UI = $(shell realpath ui)

DIR_TOOLS_UI = $(DIR_UI)/tools

.PHONY: ui-lint ui-lint-fix ui-format ui-format-check ui-typecheck

ui-lint:
	cd $(DIR_TOOLS_UI) && npm exec -- eslint --config ../../../.eslintrc.json --ignore-path ../../../.eslintignore . --ext .js,.jsx,.ts,.tsx

ui-lint-fix:
	cd $(DIR_TOOLS_UI) && npm exec -- eslint --config ../../../.eslintrc.json --ignore-path ../../../.eslintignore . --ext .js,.jsx,.ts,.tsx --fix

ui-format:
	cd $(DIR_TOOLS_UI) && npm exec -- prettier --write --config ../../../.prettierrc --ignore-path ../../../.prettierignore "**/*.{js,jsx,ts,tsx}"

ui-format-check:
	cd $(DIR_TOOLS_UI) && npm exec -- prettier --check --config ../../../.prettierrc --ignore-path ../../../.prettierignore "**/*.{js,jsx,ts,tsx}"

ui-typecheck:
	cd $(DIR_TOOLS_UI) && npm exec -- tsc --noEmit
