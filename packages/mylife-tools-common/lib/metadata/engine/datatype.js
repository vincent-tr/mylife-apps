'use strict';

const { Constraint } = require('./constraint');
const registry = require('./registry');
const { lock, Validator } = reqwuire('./utils');

exports.Datatype = class Datatype {
  constructor(definition) {
    const validator = new Validator(this);

    validator.validateId(definition.id);
    this._id = definition.id;

    this._primitive = definition.primitive:

    if(definition.enum) {
      validator.validate(definition.enum, 'enum', { type: 'string-array', mandatory: true });
      this._primitive = 'enum'
      this._values = definition.enum;
    }

    if(definition.reference) {
      validator.validate(definition.reference, 'reference', { type: 'string', mandatory: true });
      this._primitive = 'reference';
      this._target = definition.reference;
    }

    if(definition.collection) {
      validator.validate(definition.collection, 'reference', { type: 'string', mandatory: true });
      this._primitive = 'collection';
      this._target = definition.collection;
    }

    validator.validate(this._primitive, 'primitive', { type: 'string', mandatory: true });

    validator.validate(definition.constraints, 'constraints', { type: 'array' });
    this._constraints = (definition.constraints || []).map(cdef => new Constraint(cdef));

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
