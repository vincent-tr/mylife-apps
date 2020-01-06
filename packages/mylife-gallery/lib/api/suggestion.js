'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'suggestion'
};

exports.notifySuggestions = [ base, (session/*, message*/) => {
  return business.suggestionsNotify(session);
} ];

exports.createAlbum = [ base, (session, message) => {
  const { root } = message;
  return business.suggestionCreateAlbum(root);
} ];

exports.cleanOthersList = [ base, (/*session, message*/) => {
  return business.suggestionCleanOthersList();
} ];

exports.cleanDuplicatesList = [ base, (/*session, message*/) => {
  return business.suggestionCleanDuplicatesList();
} ];
