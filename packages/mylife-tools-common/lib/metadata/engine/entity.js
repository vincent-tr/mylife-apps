'use strict';

const { Constraint } = require('./constraint');
const registry = require('./registry');
const { lock, Validator } = require('./utils');

class Field {
  constructor(definition) {
    const validator = new Validator(this);

    this._id = validator.validateId(definition.id);
    this._name = validator.validate(definition.name, 'name', { type: 'string' }, this._id);
    this._description = validator.validate(definition.description, 'description', { type: 'string' });
    this._datatype = validator.validate(definition.datatype, 'datatype', { type: 'string', mandatory: true });
    this._initialValue = typeof definition.initial === undefined ? null : definition.initial;

    this._constraints = validator.validateConstraints(definition.constraints).map(cdef => new Constraint(cdef));

    this._propChain = this._id.split('.');

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

  get initialValue() {
    return this._initialValue;
  }

  get constraints() {
    return this._constraints;
  }

  setValue(object, value) {
    return setValueImpl(object, this._propChain, value);
  }

  resetValue(object) {
    return this.setValue(object, this._initialValue);
  }

  setValueMutable(object, value) {
    const chain = Array.from(this._propChain);
    const last = chain.pop();
    let current = object;
    for(const part of chain) {
      let val = current[part];
      if(!val) {
        current[part] = val = {};
      }
      current = value;
    }
    current[last] = value;
  }

  getValue(object) {
    let current = object;
    for(const prop of this._propChain) {
      current = current[prop];
      if(current === undefined || current === null) {
        break;
      }
    }
    return current;
  }
}

function setValueImpl(object, propChain, value) {
  const [ prop, ... chain ] = propChain;
  if(chain.length) {
    value = setNewValue(object[prop] || {}, chain, value);
  }
  return Object.freeze(Object.assign({}, object, { [prop] : value }));
}

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
    const localFields = validator.validate(definition.fields, 'fields', { type: 'array', defaultValue: [] }).map(fdef => new Field(fdef));
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

  newObject(values = {}) {
    let object = { _entity: this._id };
    for(const field of this._fields) {
      if(values.hasOwnProperty(field.id)) {
        const value = values[field.id];
        object = field.setValue(object, value);
      } else {
        object = field.resetValue(object);
      }
    }
    return object;
  }

  setValues(object, values) {
    for(const [key, value] of Object.entries(values)) {
      const field = this.getField(key);
      object = field.setValue(object, value);
    }
    return object;
  }
};
