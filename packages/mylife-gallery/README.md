# mylife-gallery
MyLife photo gallery

## Notes
 - tag on image: https://www.npmjs.com/package/react-rectangle-selection

# TODO:
 - spinner instead of pending image
 - thumbnail: use https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL with always 1 img tag instead of x img and css to hide
 - document:
   - modifier mots clés
     - mettre a jour le document-viewer de suite apres MAJ de la vue
     - voir comment faire la liste de recherche de l'Autocomplete
   - ajouter/supprimer album
   - ajouter/supprimer persone
   - next/prev buttons with callbacks in dialog to fetch next/prev document and hide if cb undefined
 - suggestions:
   - propose to create album of a root folder if none of the documents inside are in an album
   - propose to create script (win/\*nix) to remove duplicates (for each select the one to keep)
   - propose to create script to remove other (select with criteria)
 - route with parameters:
   - https://github.com/lastuniverse/path-to-regex/blob/master/README.md
   - here: https://github.com/vincent-tr/mylife-apps/blob/f3aa15a16858a4d7efea72d68a6f1e7437bbf589/packages/mylife-tools-ui/src/modules/routing/components/layout-router.js#L14
