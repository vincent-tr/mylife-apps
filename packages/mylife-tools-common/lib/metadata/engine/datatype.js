'use strict';

const { Constraint } = require('./constraint');
const registry = require('./registry');
const { lock, Validator } = require('./utils');
const utils = require('../../utils');

class StructureField {
  constructor(definition) {
    const validator = new Validator(this);

    this._id = validator.validateId(definition.id);
    this._name = validator.validate(definition.name, 'name', { type: 'string' }, this._id);
    this._description = validator.validate(definition.description, 'description', { type: 'string' });
    this._datatype = validator.validate(definition.datatype, 'datatype', { type: 'string', mandatory: true });

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
}

exports.Datatype = class Datatype {
  constructor(definition) {
    const validator = new Validator(this);

    this._id = validator.validateId(definition.id);
    this._primitive = definition.primitive;

    if(definition.enum) {
      this._primitive = 'enum'
      this._values = validator.validate(definition.enum, 'enum', { type: 'string-array', mandatory: true });
    }

    if(definition.reference) {
      this._primitive = 'reference';
      this._target = validator.validate(definition.reference, 'reference', { type: 'string', mandatory: true });
    }

    if(definition.list) {
      this._primitive = 'list';
      this._item = validator.validate(definition.list, 'list', { type: 'string', mandatory: true });
    }

    if(definition.map) {
      this._primitive = 'map';
      this._item = validator.validate(definition.map, 'map', { type: 'string', mandatory: true });
    }

    if(definition.structure) {
      this._primitive = 'structure';
      this._fields = validator.validate(definition.structure, 'structure', { type: 'array', defaultValue: [] }).map(fdef => new StructureField(fdef));
      this._fieldMap = utils.indexBy(this._fields, 'id');
      Object.freeze(this._fields);
      Object.freeze(this._fieldMap);
    }

    validator.validate(this._primitive, 'primitive', { type: 'string', mandatory: true });

    this._constraints = validator.validateConstraints(definition.constraints).map(cdef => new Constraint(cdef));

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

  get item() {
    if(!this._item) {
      throw new Error(`Cannot access item on '${this.id}' datatype`);
    }
    return registry.getDatatype(this._item);
  }

  get fields() {
    if(!this._fields) {
      throw new Error(`Cannot access fields on '${this.id}' datatype`);
    }
    return this._fields;
  }

  getField(id) {
    this.fields; // access check
    const field = this._fieldMap[id];
    if(!field) {
      throw new Error(`Field not found '${id}' on '${this.id}' datatype`)
    }
  }

  get constraints() {
    return this._constraints;
  }
};
