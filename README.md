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

# TODO

## TODO TS

- do repos : portal, gallery, monitor, explorer


## Next

- portal: bootstrap 3 -> 5
- mui v5
- mui pickers not supported (update to mui v5)
- gallery => webpconverter not supported => https://www.npmjs.com/package/sharp
- */bin/* : cleanup other than server?
- remove babel after we have no jsx, only tsx
- remove fonts ? (2 first includes of ui/src/index.js)
- review lint
- review defines :
  - __dirname usage :
    - http server public dir
    - config dir
- ramener la TODO liste ici