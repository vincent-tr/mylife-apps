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

- webpack watch client
- web-server sert toujours un bundle static
- webpack build server
- build image docker a partir des fichiers locaux de release
- can we remove babel ? is ts-loader enough ?

- webpack dev server ?
- remove fonts ? (2 first includes of ui/src/index.js)

## Update

- portal: bootstrap 3 -> 5
- mui v5
- mui pickers not supported (update to mui v5)
- gallery => webpconverter not supported => https://www.npmjs.com/package/sharp
- */bin/* : cleanup other than server?