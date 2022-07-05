import { lock, Validator } from './utils';

export type ConstraintDefinition = string | [string, ...unknown[]];

export default class Constraint {
  public readonly id: string;
  public readonly args: unknown[];

  constructor(definition: ConstraintDefinition) {
    if(Array.isArray(definition)) {
      const [id, ...args] = definition;
      this.id = id;
      this.args = args;
    } else {
      this.id = definition;
      this.args = [];
    }

    const validator = new Validator(this);
    validator.validateId(this.id);
    validator.validate(this.args, 'args', { type: 'array' });

    Object.freeze(this.args);
    lock(this);
  }
};
