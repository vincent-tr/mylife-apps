'use strict';

const { notifyView, StoreContainer } = require('mylife-tools-server');
const business = require('.');

exports.documentNotify = (session, type, id) => {
  const collection = business.getDocumentStoreCollection(type);
  return notifyView(session, collection.createView(document => document._id === id));
};

exports.documentsNotify = (session, criteria) => {
  const view = new DocumentView();
  view.setCriteria(criteria);
  return notifyView(session, view);
};

class DocumentView extends StoreContainer {

  setCriteria(criteria) {
    this._criteria = criteria;
    this._compute();
  }

  refresh() {
    this._compute();
  }

  close() {
  }

  _compute() {

  }
}
