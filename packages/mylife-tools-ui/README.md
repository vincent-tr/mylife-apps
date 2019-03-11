# mylife-tools-ui
MyLife Tools UI

## css notes

* better css : https://blog.theodo.fr/2018/06/write-better-css-part-1/
* flex/grid :
  * https://medium.com/youstart-labs/beginners-guide-to-choose-between-css-grid-and-flexbox-783005dd2412
  * https://hackernoon.com/the-ultimate-css-battle-grid-vs-flexbox-d40da0449faf

## UX

### Main layout :

#### desktop large :
* header haut : titre app, puis titre fenetre
* a gauche : menu app

#### desktop :
* header haut : titre app, menu, titre fenetre

#### mobile :
* header haut : ligne 1 : titre app, ligne 2 : titre fenetre, icon pour afficher menu
* clic sur icone => menu en overlay a gauche

#### tablette :
* ???

### Examples :
* https://geomax-positioning.com/

### Tips :
* Tout accessible en 3 clics

## react/redux notes

* Dossiers par feature plutôt que components constantes etc
* Plusieurs fichiers constante
* Bind avec props en arrow
* noop action ?

## Webpack/npm packaging

* https://webpack.js.org/guides/author-libraries/
* https://webpack.js.org/guides/production/
* https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220

## TODO:
* editors :
  * field avec :
    - datatype (ex: count qui est un entier positif)
    - rules (ex: required, upperBound(10) ) qui est implémenté en validators mais qui peut être géré sur la UI de l éditeur aussi
    - nom du field
