'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'suggestion'
};

exports.notifySuggestions = [ base, (session/*, message*/) => {
  return business.suggestionsNotify(session);
} ];
