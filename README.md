# mylife-apps
MyLife Applications

## Update packages
 - lerna exec -- rm -rf ./node_modules
 - lerna exec -- npm update
 - lerna bootstrap

## Build
 - lerna version
 - lerna publish

## Docker Build
 - TODO
 - lerna run build:docker
 - docker push vincenttr/mylife-explorer
