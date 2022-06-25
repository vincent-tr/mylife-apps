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

# Notes

- portal bug CSS

## TODO TS

- passer avec le build de mylife-home (+build server), mettre TS en mode permissif et renommer tous les .js? en .ts?
- livrer

## Update

- mui v5
- mui pickers not supported (update to mui v5)
- gallery => webpconverter not supported => https://www.npmjs.com/package/sharp