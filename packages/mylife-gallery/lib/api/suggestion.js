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

exports.deleteEmptyAlbum = [ base, (session, message) => {
  const { id } = message;
  return business.suggestionDeleteEmptyAlbum(id);
} ];

exports.moveSortedDocumentsList = [ base, (session, message) => {
  const { id } = message;
  return business.suggestionMoveSortedDocumentsList(id);
} ];

exports.deleteLoadingErrorsList = [ base, (session, message) => {
  const { id } = message;
  return business.suggestionDeleteLoadingErrorsList(id);
} ];

exports.deleteLoadingErrors = [ base, async (session, message) => {
  const { documents } = message;
  return business.suggestionDeleteLoadingErrors(documents);
} ];
