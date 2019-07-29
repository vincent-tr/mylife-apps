'use strict';

const { Constraint } = require('./constraint');
const registry = require('./registry');
const { lock, Validator } = reqwuire('./utils');

exports.Datatype = class Datatype {
  constructor(definition) {
    const validator = new Validator(this);

    this._id = validator.validateId(definition.id);
    this._primitive = definition.primitive:

    if(definition.enum) {
      this._primitive = 'enum'
      this._values = validator.validate(definition.enum, { type: 'string-array', mandatory: true });
    }

    if(definition.reference) {
      this._primitive = 'reference';
      this._target = validator.validate(definition.reference, 'reference', { type: 'string', mandatory: true });
    }

    if(definition.collection) {
      this._primitive = 'collection';
      this._target = validator.validate(definition.collection, 'reference', { type: 'string', mandatory: true });
    }

    validator.validate(this._primitive, 'primitive', { type: 'string', mandatory: true });

    this._constraints = validator.validate(definition.constraints, 'constraints', { type: 'array', defaultValue: [] }).map(cdef => new Constraint(cdef));

    Object.freeze(this._constraints);
    lock(this);
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
