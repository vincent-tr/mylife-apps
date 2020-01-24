# mylife-gallery
MyLife photo gallery

## Notes
 - tag on image: https://www.npmjs.com/package/react-rectangle-selection
 - tag on image: https://github.com/justadudewhohacks/face-api.js/
 - mode defilement: https://www.w3schools.com/howto/howto_js_fullscreen.asp or https://github.com/Darth-Knoppix/example-react-fullscreen

# TODO:
 - slideshow
   - url pour défilement (routage)
   - LRU pour object URL de l'engine
 - album:
   - album detail
   - doc delete
   - choose album thumbnails
   - delete album
 - persons management
   - update firstName/lastName
   - choose thumbnails
   - delete person
 - document:
   - rotation image/video (créer nouveau média/thumbnail à cause du cache http, donc créer un nouvel id) => NON, on va faire ca dans l explorateur et il sera reimporte
   - pouvoir modifier la date d une image/video ou pouvoir la re-importer depuis la metadata
 - suggestions:
   - Suggestion pour ajouter un document a un album s'il n'a pas d album et que l'abum correspondant au root existe deja (genre un doc qu on aurait sorti d un album), sauf si le dossier commence par _
   - Suggestion pour montrer les documents sans album
   - Suggestion pour créer un script pour déplacer les fichiers dans des dossiers correspondant a l album si les fichiers sont dans un dossier commençant par _ (eg: \_ATrier)
   - Suggestion pour supprimer les albums vides
   - Suggestion pour supprimer document other avec loadingError (pour le re-sync)
 - browse (+liste album ?)
   - criteria: rajouter date nulle
   - sélection multiple dans liste de photo et création/affection d'album comme labels Gmail + création/affection de personnes
 - sync
   - date images foireuses ? 1/1/1970, 1980 ? timetamps bizarres ?
   - rajouter l'heure si possible (sympa de savoir si c est le matin, le soir, etc)
 - mobile
  - enlever Diaporamas
  - enlever Suggestions
  - adapter nav-bar  document-viewer (si titre trop grand, peut etre sur 2 lignes ?)
  - adapter detail document-viewer (devrait etre fullscreen, ne pas afficher le doc
  - adapter criteria albums
  - adapter criteria browse
