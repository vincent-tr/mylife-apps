BIN         = ./node_modules/.bin
MOCHA       = $(BIN)/mocha
ESLINT      = $(BIN)/eslint
JSPM        = $(BIN)/jspm
NODE        = node
MOCHA_OPTS  = --timeout 2000 --recursive -b
REPORTER    = spec
TEST_FILES  = test

lint:
	$(ESLINT) lib/* public/app/*

start:
	$(NODE) bin/server.js

bundle:
	$(JSPM) bundle app/main public/build.js