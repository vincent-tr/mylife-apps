'use strict';

module.exports = {
  id: 'account',
  parent: 'base',
  name: 'Compte de courtier de trading',
  fields: [
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'key', name: 'Clé IG', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'identifier', name: 'Identifiant IG', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'password', name: 'Mot de passe IG', datatype: 'password', constraints: ['not-null', 'not-empty'] },
    { id: 'demo', name: 'Est-ce un compte de démo', datatype: 'boolean', constraints: ['not-null'] }
  ],
  display: obj => obj.display
};
