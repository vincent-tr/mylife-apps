import { getService } from '../service-manager';
import { View } from './view';
import { Container } from './container';

export class Collection extends Container {
  constructor(name: string, public readonly databaseCollection, public readonly entity) {
    super(name);
  }

  setupIndex(configuration) {
    // TODO
    void configuration;

    // https://www.npmjs.com/package/btreejs
  }

  load(object) {
    this.set(object);
  }

  set(object) {
    if(object._entity !== this.entity.id) {
      throw new Error(`Cannot set object of entity '${object._entity}' on collection '${this.name}', expected '${this.entity.id}' entity type`);
    }

    let id = object._id;
    if(!id) {
      id = this.newId();
      object = this.entity.getField('_id').setValue(object, id);
    }

    this.set(object);

    return object;
  }

  delete(id) {
    return this.delete(id);
  }

  createView(filterCallback = () => true) {
    const view = new View(this);
    view.setFilter(filterCallback);
    return view;
  }

  newId() {
    return getService('database').newObjectID().toString();
  }
};
