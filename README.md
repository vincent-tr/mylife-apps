# mylife-apps
MyLife Applications

## Update packages
 - `lerna clean`
 - `lerna exec -- npm update`
 - `lerna exec -- ncu -u` (for major version updates)
 - `lerna bootstrap`

## Build
 - `lerna publish`
 - `lerna publish from-package` (without bump version)

## Docker Build
 - `lerna run build:docker`
 - `cd repo; npm run build:docker` (or for one repository)
