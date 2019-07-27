'use strict';

const { Constraint } = require('./constraint');
const registry = require('./registry');

exports.Datatype = class Datatype {
  constructor(definition) {
    this._id = definition.id;
    this._primitive = definition.primitive:

    if(definition.enum) {
      this._primitive = 'enum'
      this._values = definition.enum;
    }

    if(definition.reference) {
      this._primitive = 'reference';
      this._target = definition.reference;
    }

    if(definition.collection) {
      this._primitive = 'collection';
      this._target = definition.collection;
    }

    this._constraints = definition.constraints || [];

    // TODO: validation/freeze
  }

  get id() {
    return this._id;
  }

  get primitive() {
    return this._primitive;
  }

  get values() {
    if(!this._values) {
      throw new Error(`Cannot access values on '${this.id}' datatype`);
    }
    return this._values;
  }

  get target() {
    if(!this._target) {
      throw new Error(`Cannot access target on '${this.id}' datatype`);
    }
    return registry.getEntity(this._target);
  }

  constraints() {
    return this._constraints;
  }
};
