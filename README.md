# mylife-apps
MyLife Applications

## Update packages
 - `lerna clean`
 - `lerna exec -- npm update`
 - `lerna exec -- ncu -u` (for major version updates)
 - `lerna bootstrap`

## Build
 - `lerna version`
 - `lerna run docker-publish`
 - `cd repo; npm run docker-publish` (or for one repository)

# Framework (tools)

## Orgnization

### common
- datatypes/entities
- localization

### ui
- material ui
- editors
- shared workers/offline ?
- web socket -> dataview with update notifications
- request/response on top of web socket
- each tab = websocket
- no offline mode
- no service worker for now
- routing
- master layout
- redux base
- dialogs

### server
- config management
- docker
- mongo
- business
- web api, session, websocket

## Notes

### UI

- Tout accessible en 3 clics

### DATABASE
- < 1 million record -> in memory store(cf node-dirty)
- whole DB in memory
- with freeze on each object => update = replace whole object
- keep update history + version + tracability (ts + user)
- event fired on update
- collections
- indexes (auto create on requests ?)
- dataview with filters and event on change

# TODO

- mui v5
- mui pickers not supported (update to mui v5)
- */bin/* : cleanup other than server?
- remove babel after we have no jsx, only tsx
- remove fonts ? (2 first includes of ui/src/index.js)
- review lint
- review defines :
  - __dirname usage :
    - http server public dir
    - config dir

## Tools UI

- editors :
  - editor : edition basique, avec des proprietes pour gerer le specificites du contenu
  - field avec :
    - datatype (ex: count qui est un entier positif)
    - rules (ex: required, upperBound(10) ) qui est implémenté en validators mais qui peut être géré sur la UI de l éditeur aussi
    - nom du field
- globalization
- charts : http://recharts.org/


## Portal

- bootstrap 3 -> 5

## Gallery

- les fichiers avec une taille a 0 ne doivent pas être des copies les uns des autres
- utiliser le fs et nginx au lieu de mongo gridfs (et thumbnails?)
- suggestion pour supprimer les dossiers/albums vides
- suggestion pour afficher les différences entre le filesystem et les albums
- suggestion pour déplacer les documents mal rangé (1 seul chemin, 1 seul album, , et ils ne correspondent pas ou alors plusieurs albums mais le chemin ne correspond à aucun => choix de déplacement)
- slideshow: bug d ancienne image qui apparait un bref instant apres transition

## Money

- apres import csv, les operations n'apparaissent pas dans "non triés" mais la date de derniere integration est mise a jour
