export class CollectionSubscription {
  constructor(private readonly view, private readonly collection, private readonly changeCallback = (event) => this.view.onCollectionChange(this.collection, event)) {
    this.collection.on('change', this.changeCallback);
  }

  unsubscribe() {
    this.collection.off('change', this.changeCallback);
  }
}
