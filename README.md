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

## Organization

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

### Metadata

- DATATYPE :
  - Nom interne (id) (exemple : amount ou batchnumber ou string ou password ou gender(m/f) )
  - Type de données js (déduit auto pour enum ou reference)
  - enum: ['liste', 'des', 'valeurs'] => indique que le type est une enum, avec sa liste de valeurs
  - reference: 'target entity id' => indique que le type est une FK avec sa cible
  - collection: 'target entity id' => indique que le type est collection 'embedded', avec l'entité cible contenue dedans, en map avec une clé string (l'entité cible n'a pas besoin de PK)
  - constraints: ['contrainte1', ['contrainte2', arg1, arg2]] (eg: ['positive', ['max', 100]])
  - (Créer un Datatype de FK par entité, automatiser la creation)

- FIELD :
  - Nom interne (id)
  - Nom affiché
  - Description
  - Datatype
  - constraints: ['not-null', 'read-only']

- ENTITY :
  - Parent (héritage de définition d’entité)
  - Nom interne (id)
  - Nom affiché
  - Description
  - Liste de champs
  - fonction d'affichage de l'entité
  - constraints: ['custom-constraint1', ['at-least-one-not-null', 'field1', 'field2']]

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
- redux toolkit for state updates instead of immutable objects
- log app + tools version at startup
- remove PropTypes use
- FIXME_any

## Tools UI

- editors :
  - editor : edition basique, avec des proprietes pour gerer le specificites du contenu
  - field avec :
    - datatype (ex: count qui est un entier positif)
    - rules (ex: required, upperBound(10) ) qui est implémenté en validators mais qui peut être géré sur la UI de l éditeur aussi
    - nom du field
- globalization
- charts : http://recharts.org/

## Gallery

- BUG: affichage liste de document, puis impossible de decocher selection album/personne pour associer un document à un album/une personne
- integrer les fichiers HEIC
- pouvoir réintegrer les 'autres'
- ignorer certains fichiers : Thumbs.db, .DS_Store
- les fichiers avec une taille a 0 ne doivent pas être des copies les uns des autres
- suggestion pour supprimer les dossiers/albums vides
- suggestion pour afficher les différences entre le filesystem et les albums
- suggestion pour déplacer les documents mal rangé (1 seul chemin, 1 seul album, et ils ne correspondent pas ou alors plusieurs albums mais le chemin ne correspond à aucun => choix de déplacement)
- suggestion pour ajouter des photos a un album existant si elles sont dans un dossier qui correspond a un album
- slideshow: bug d ancienne image qui apparait un bref instant apres transition
- parcourir: sur selection multiple et clic sur personnes, elles sont toutes selectionnees
- reconnaissance des visages
- meilleure gestion des lieux des photos (eg: pouvoir rechercher les photos a Vourles)

## Money

- Gestion des regles
  - avoir une vue unifiée des regles
  - la gestion des regles est moche
  - avoir un apercu des effets d'une regle
    - executer l'apercu sur le group de la regle pour montrer ce qu'elle aurait deplacé
    - executer l'apercu sur les non tries pour montrer ce qu'elle pourra deplacer
- bots
  - tous les mois un robot presente un summary (nombre d'ops non triées, graphiques, etc) par mail, avec le dernier fichier du scraper CIC
  - pouvoir intégrer à nagios ou mail des erreurs de bots
  - cleanup des runs
- scraping PayPal (par scan des mails ou API ?)
- scraping Amazon (par scan des mails ?)
- UX
  - sur mobile dans la liste gestion, le footer de liste n'apparait pas?
  - sur mobile dans la liste gestion, groupe par date
  - ne pas redimensionner le popup de treeview de groups en fonction du contenu
  - ne pas redimensionner le treeview dans management quand on replie (il devrait avoir une largeur fixe)
- Saisie de note :
  - le debounce est pourri
  - permettre plusieurs lignes (voir comment afficher dans la liste, eg : 1iere ligne + ..., et détails en tooltip ?)
  - permettre de créer des hyperlinks dans les notes
  - rich text/MD ?
- Permettre d'ajouter des notes sur les groupes (et les voir en tooltips)
- Permettre de rechercher des groupes ?

## Portal

- bootstrap 3 -> 5
