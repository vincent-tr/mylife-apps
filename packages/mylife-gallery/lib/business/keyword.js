'use strict';

const { getStoreCollection } = require('mylife-tools-server');
const { getDocumentStoreCollections } = require('./document');

exports.keywordList = () => {
  const keywords = new Set();
  const collections = [...getDocumentStoreCollections(), getStoreCollection('album')];
  for(const collection of collections) {
    for(const object of collection.list()) {
      for(const keyword of object.keywords) {
        keywords.add(keyword);
      }
    }
  }
  return Array.from(keywords);
};
