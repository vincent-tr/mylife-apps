# mylife-apps
MyLife Applications

## Update packages
 - lerna exec -- rm -rf ./node_modules
 - lerna exec -- npm update
 - lerna bootstrap

## Build
 - lerna publish
or without bump version
 - lerna publish from-package

## Docker Build
 - lerna run build:docker
