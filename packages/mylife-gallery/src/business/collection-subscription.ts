export class CollectionSubscription {
  constructor(private readonly view, private readonly collection, private readonly changeCallback) {
    this.collection.on('change', this.changeCallback);
  }

  unsubscribe() {
    this.collection.off('change', this.changeCallback);
  }
}
