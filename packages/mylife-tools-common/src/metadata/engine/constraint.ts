import { lock, Validator } from './utils';

export default class Constraint {
  constructor(definition) {
    if(Array.isArray(definition)) {
      const [id, ...args] = definition;
      this._id = id;
      this._args = args;
    } else {
      this._id = definition;
      this._args = [];
    }

    const validator = new Validator(this);
    validator.validateId(this._id);
    validator.validate(this._args, 'args', { type: 'array' });

    Object.freeze(this._args);
    lock(this);
  }

  get id() {
    return this._id;
  }

  get args() {
    return this._args;
  }
};
