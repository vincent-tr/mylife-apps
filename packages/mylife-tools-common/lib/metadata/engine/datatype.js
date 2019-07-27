'use strict';

exports.Datatype = class Datatype {
  constructor(definition) {
    this.id = definition.id;
    this.primitive = definition.primitive:

    if(definition.enum) {
      this.primitive = 'enum'
      this.values = definition.enum;
    }

    if(definition.reference) {
      this.primitive = 'reference';
      this.target = definition.reference:
    }

    if(definition.collection) {
      this.primitive = 'collection';
      this.target = definition.collection:
    }

    this.constraints = definition.constraints;
  }
};
