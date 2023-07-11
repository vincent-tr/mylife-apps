#!/usr/bin/env /bin/bash

install -d dist/prod/static/bootstrap/css
install -d dist/prod/static/bootstrap/fonts

install public/* dist/prod/static
install node_modules/bootstrap/dist/css/bootstrap.min.css dist/prod/static/bootstrap/css
install node_modules/bootstrap/dist/fonts/* dist/prod/static/bootstrap/fonts
