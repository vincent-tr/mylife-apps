# mylife-gallery
MyLife photo gallery

## Notes
 - tag on image: https://www.npmjs.com/package/react-rectangle-selection
 - tag on image: https://github.com/justadudewhohacks/face-api.js/
 - mode defilement: https://www.w3schools.com/howto/howto_js_fullscreen.asp

# TODO:
 - document:
   - ajouter/supprimer personne
   - rotation image/video
 - suggestions:
   - Suggestion pour montrer les documents sans album
   - Suggestion pour créer un script pour déplacer les fichiers dans des dossiers correspondant a l album si les fichiers sont dans un dossier commençant par _ (eg: \_ATrier)
   - Suggestion pour supprimer les albums vides
   - Suggestion pour supprimer document other avec loadingError (pour le re-sync)
 - route with parameters:
   - https://github.com/lastuniverse/path-to-regex/blob/master/README.md
   - here: https://github.com/vincent-tr/mylife-apps/blob/f3aa15a16858a4d7efea72d68a6f1e7437bbf589/packages/mylife-tools-ui/src/modules/routing/components/layout-router.js#L14
 - browse (+liste album ?)
   - sélection multiple dans liste de photo et création/affection d'album comme labels Gmail
   - criteria collapsed albums
   - criteria disable albums multi-select if no-album checked
 - document/album/person delete: handle properly deletion of dependencies
   - document: thumbnails
   - album: thumbnails
   - person: documents
 - sync
   - date images foireuses ? 1/1/1970, 1980 ?
