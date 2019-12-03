'use strict';

exports.CollectionSubscription = class CollectionSubscription {
  constructor(view, collection) {
    this.view = view;
    this.collection = collection;
    this.changeCallback = event => this.view._onCollectionChange(this.collection, event);
    this.collection.on('change', this.changeCallback);
  }

  unsubscribe() {
    this.collection.off('change', this.changeCallback);
  }
};
