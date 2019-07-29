'use strict';

const { Constraint } = require('./constraint');
const registry = require('./registry');
const { lock, Validator } = reqwuire('./utils');

class Field {
  constructor(definition) {
    const validator = new Validator(this);

    this._id = validator.validateId(definition.id);
    this._name = validator.validate(definition.name, 'name', { type: 'string' }, this._id);
    this._description = validator.validate(definition.description, 'description', { type: 'string' });
    this._datatype = validator.validate(definition.datatype, 'datatype', { type: 'string', mandatory: true });

    this._constraints = validator.validateConstraints(definition.constraints).map(cdef => new Constraint(cdef));

    Object.freeze(this._constraints);
    lock(this);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get datatype() {
    return registry.getDatatype(this._datatype);
  }

  get constraints() {
    return this._constraints;
  }
};

exports.Entity = class Entity {
  constructor(definition) {
    const validator = new Validator(this);

    this._id = validator.validateId(definition.id);

    const parent = validator.validate(definition.parent, 'parent', { type: 'string' });
    if(parent) {
      this._parent = registry.getEntity(parent);
    }

    this._name = validator.validate(definition.name, 'name', { type: 'string' }, this._id);
    this._description = validator.validate(definition.description, 'description', { type: 'string' });
    this._display = validator.validate(definition.display, 'display', { type: 'function' });

    const parentFields = this._parent ? this._parent.fields : [];
    const localFields = validator.validate(value, 'fields', { type: 'array', defaultValue: [] }).map(fdef => new Field(fdef));
    this._fields = [...parentFields, ...localFields];

    const parentConstraints = this._parent ? this._parent.constraints : [];
    const localConstraints = validator.validateConstraints(definition.constraints).map(cdef => new Constraint(cdef));
    this._constraints = [...parentConstraints, ...localConstraints];

    validator.validateUnique(this._fields.map(({ id }) => id), 'fields');
    this._fieldsById = new Map();
    for(const field of this._fields) {
      this._fieldsById.set(field.id, field);
    }

    Object.freeze(this._fieldsById);
    Object.freeze(this._fields);
    Object.freeze(this._constraints);
    lock(this);
  }

  get id() {
    return this._id;
  }

  get parent() {
    return this._parent;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get display() {
    return this._display;
  }

  get fields() {
    return this._fields;
  }

  findField(id) {
    return this._fieldsById.get(id);
  }

  getField(id) {
    const field = this._fieldsById.get(id);
    if(field) {
      return field;
    }
    throw new Error(`Field '${id}' not found on entity '${this._id}'`);
  }

  get constraints() {
    return this._constraints;
  }
};
