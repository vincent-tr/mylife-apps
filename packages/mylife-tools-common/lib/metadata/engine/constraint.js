'use strict';

exports.Constraint = class Constraint {
  constructor(definition) {
    if(Array.isArray(definition)) {
      const [id, ...args] = definition;
      this.id = id;
      this.args = args;
    } else {
      this.id = definition;
      this.args = [];
    }
  }
};
