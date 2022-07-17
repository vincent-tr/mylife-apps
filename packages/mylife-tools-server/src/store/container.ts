import EventEmitter from 'events';
import objectEquals from 'fast-deep-equal';

export interface Event {
  type: 'create' | 'update' | 'remove';
  before?;
  after?;
}

export class Container extends EventEmitter {
  private readonly items = new Map();

  constructor(public readonly name: string) {
    super();
  }

  protected _reset() {
    this.items.clear();
  }

  protected _set(object) {
    const id = object._id;
    const existing = this.find(id);

    // if same, no replacement, no emitted event
    if (existing && objectEquals(existing, object)) {
      return existing;
    }

    this.items.set(id, object);

    const event: Event = { type: 'create', after: object };
    if (existing) {
      event.before = existing;
      event.type = 'update';
    }
    this.emit('change', event);

    return object;
  }

  protected _delete(id) {
    const existing = this.find(id);
    if (!existing) {
      return false;
    }

    this.items.delete(id);

    this.emit('change', { type: 'remove', before: existing });

    return true;
  }

  protected _replaceAll(objects) {
    const removeSet = new Set(this.items.keys());
    for (const object of objects) {
      removeSet.delete(object._id);
    }
    for (const id of removeSet) {
      this._delete(id);
    }

    for (const object of objects) {
      this._set(object);
      removeSet.delete(object._id);
    }
  }

  find(id) {
    return this.items.get(id);
  }

  get(id) {
    const object = this.find(id);
    if (object) {
      return object;
    }
    throw new Error(`Object with id '${id}' not found on collection '${this.name}'`);
  }

  list() {
    return Array.from(this.items.values());
  }

  get size() {
    return this.items.size;
  }

  filter(callback) {
    const array = [];
    for (const value of this.items.values()) {
      if (callback(value)) {
        array.push(value);
      }
    }
    return array;
  }

  exists(callback) {
    for (const value of this.items.values()) {
      if (callback(value)) {
        return true;
      }
    }
    return false;
  }
}
