# mylife-gallery
MyLife photo gallery

## Notes
 - tag on image: https://www.npmjs.com/package/react-rectangle-selection

# TODO:
 - document:
   - ajouter/supprimer album (comme labels gmail)
   - ajouter/supprimer personne
 - suggestions:
   - suggest to not do anything while we are syncing (last integration date < 10 mins)
   - propose to create album of a root folder if none of the documents inside are in an album (and does not start with _ )
   - propose to create script (win/\*nix) to remove duplicates (for each select the one to keep, better candidate for deletion if folder starts with _ )
   - propose to create script to remove other (select with criteria)
   - Faire une suggestion pour créer un script pour déplacer les fichiers dans des dossiers correspondant a l album si les fichiers sont dans un dossier commençant par _ (eg: \_ATrier)
 - route with parameters:
   - https://github.com/lastuniverse/path-to-regex/blob/master/README.md
   - here: https://github.com/vincent-tr/mylife-apps/blob/f3aa15a16858a4d7efea72d68a6f1e7437bbf589/packages/mylife-tools-ui/src/modules/routing/components/layout-router.js#L14
 - browse (+liste album ?)
   - sélection multiple dans liste de photo et création/affection d'album comme labels Gmail
