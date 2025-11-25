import Constraint, { ConstraintDefinition } from './constraint';
import * as registry from './registry';
import { lock, Validator } from './utils';
import * as utils from '../../utils';

export type StructureFieldDefinition = {
  id: string;
  name?: string;
  description?: string;
  datatype: string;
};

class StructureField {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  private readonly _datatype: string;

  constructor(definition: StructureFieldDefinition) {
    const validator = new Validator(this);

    this.id = validator.validateId(definition.id);
    this.name = validator.validate(definition.name, 'name', { type: 'string' });
    this.description = validator.validate(definition.description, 'description', { type: 'string' });
    this._datatype = validator.validate(definition.datatype, 'datatype', { type: 'string', mandatory: true });

    lock(this);
  }

  get datatype() {
    return registry.getDatatype(this._datatype);
  }
}

export type DatatypeDefinition = {
  id: string;
  primitive?: string;
  enum?: string[];
  reference?: string;
  list?: string;
  map?: string;
  structure?: StructureFieldDefinition[];
  constraints?: ConstraintDefinition[];
};

export default class Datatype {
  public readonly id: string;
  public readonly primitive: string;
  private readonly _values: string[];
  private readonly _target: string;
  private readonly _item: string;
  private readonly _fields: StructureField[];
  private readonly _fieldMap: { [id: string]: StructureField };
  public readonly constraints: Constraint[];

  constructor(definition: DatatypeDefinition) {
    const validator = new Validator(this);

    this.id = validator.validateId(definition.id);
    this.primitive = definition.primitive;

    if (definition.enum) {
      this.primitive = 'enum';
      this._values = validator.validate(definition.enum, 'enum', { type: 'string-array', mandatory: true });
    }

    if (definition.reference) {
      this.primitive = 'reference';
      this._target = validator.validate(definition.reference, 'reference', { type: 'string', mandatory: true });
    }

    if (definition.list) {
      this.primitive = 'list';
      this._item = validator.validate(definition.list, 'list', { type: 'string', mandatory: true });
    }

    if (definition.map) {
      this.primitive = 'map';
      this._item = validator.validate(definition.map, 'map', { type: 'string', mandatory: true });
    }

    if (definition.structure) {
      this.primitive = 'structure';
      this._fields = validator.validate(definition.structure, 'structure', { type: 'array', defaultValue: [] }).map((fdef) => new StructureField(fdef));
      this._fieldMap = utils.indexBy(this._fields, 'id');
      Object.freeze(this._fields);
      Object.freeze(this._fieldMap);
    }

    validator.validate(this.primitive, 'primitive', { type: 'string', mandatory: true });

    this.constraints = validator.validateConstraints(definition.constraints).map((cdef) => new Constraint(cdef));

    Object.freeze(this.constraints);
    lock(this);
  }

  get values() {
    if (!this._values) {
      throw new Error(`Cannot access values on '${this.id}' datatype`);
    }
    return this._values;
  }

  get target() {
    if (!this._target) {
      throw new Error(`Cannot access target on '${this.id}' datatype`);
    }
    return registry.getEntity(this._target);
  }

  get item() {
    if (!this._item) {
      throw new Error(`Cannot access item on '${this.id}' datatype`);
    }
    return registry.getDatatype(this._item);
  }

  get fields() {
    if (!this._fields) {
      throw new Error(`Cannot access fields on '${this.id}' datatype`);
    }
    return this._fields;
  }

  getField(id: string) {
    void(this.fields); // access check

    const field = this._fieldMap[id];
    if (!field) {
      throw new Error(`Field not found '${id}' on '${this.id}' datatype`);
    }

    return field;
  }
}
