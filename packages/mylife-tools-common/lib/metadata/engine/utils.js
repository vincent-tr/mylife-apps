'use strict';

exports.lock = (object) => {

  const config = { enumerable: false };
  for (const propName of Object.getOwnPropertyNames(obj)) {
    if(propName.startsWith('_')) {
      Object.defineProperty(obj, propName, { enumerable: false });
    }
  }

  Object.freeze(this);
};

exports.Validator = class Validator {
  constructor(obj) {
    this._objectType = obj.constructor.name;
  }

  validateId(id) {
    if(!id) {
      throw new Error(`Metadata validation failed: id is mandatory for ${objectType}`);
    }
    if(typeof id !== 'string') {
      throw new Error(`Metadata validation failed: id must be 'string' for ${objectType}`);
    }
    this._id = id;
    this._objectString = `${this._objectType}(${this._id})`;

    return id;
  }

  validate(value, argumentName, { type, mandatory = false, defaultValue }) {
    if(value === null || value === undefined) {
      if(mandatory) {
        throw new Error(`Metadata validation failed: ${argumentName} is mandatory for ${this._objectString}`);
      }
      return defaultValue;
    }

    const matchArray = /^(.*)-array$/.exec(type);
    if(matchArray) {
      const itemType = matchArray[1];
      this.validate(value, argumentName, { type: 'array', mandatory });
      for(const [i, item] of (value || []).entries()) {
        this.validate(value, `${argumentName}[${i}]`, { type: itemType, mandatory: true });
      }
      return value;
    }

    if(getType(value) !== type) {
      throw new Error(`Metadata validation failed: ${argumentName} must be '${type}' for ${this._objectString}`);
    }

    return value;
  }
};

function getType(obj) {
  if(obj instanceof Function) {
    return 'function';
  }
  if(Array.isArray(obj)) {
    return 'array';
  }
  return typeof(obj);
}
