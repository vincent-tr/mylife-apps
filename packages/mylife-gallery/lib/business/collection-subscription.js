'use strict';

exports.CollectionSubscription = class CollectionSubscription {
  constructor(view, collection, changeCallback = event => this.view.onCollectionChange(this.collection, event)) {
    this.view = view;
    this.collection = collection;
    this.changeCallback = changeCallback;
    this.collection.on('change', this.changeCallback);
  }

  unsubscribe() {
    this.collection.off('change', this.changeCallback);
  }
};
