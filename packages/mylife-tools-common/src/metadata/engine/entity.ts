import Constraint, { ConstraintDefinition } from './constraint';
import * as registry from './registry';
import { lock, Validator } from './utils';

export type FieldDefinition = {
  id: string;
  name?: string;
  description?: string;
  datatype: string;
  initial?: unknown;
  constraints?: ConstraintDefinition[];
};

class Field {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  private readonly _datatype: string;
  public readonly initialValue: unknown;
  public readonly constraints: Constraint[];
  private readonly propChain: string[];

  constructor(definition: FieldDefinition) {
    const validator = new Validator(this);

    this.id = validator.validateId(definition.id);
    this.name = validator.validate(definition.name, 'name', { type: 'string' });
    this.description = validator.validate(definition.description, 'description', { type: 'string' });
    this._datatype = validator.validate(definition.datatype, 'datatype', { type: 'string', mandatory: true });
    this.initialValue = definition.initial === undefined ? null : definition.initial;

    this.constraints = validator.validateConstraints(definition.constraints).map(cdef => new Constraint(cdef));

    this.propChain = this.id.split('.');

    Object.freeze(this.constraints);
    lock(this);
  }

  get datatype() {
    return registry.getDatatype(this._datatype);
  }

  setValue(object, value) {
    return setValueImpl(object, this.propChain, value);
  }

  resetValue(object) {
    return this.setValue(object, this.initialValue);
  }

  setValueMutable(object, value) {
    const chain = Array.from(this.propChain);
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
    for(const prop of this.propChain) {
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
    value = setValueImpl(object[prop] || {}, chain, value);
  }
  return Object.freeze(Object.assign({}, object, { [prop] : value }));
}

export type EntityDefinition = {
  id: string;
  parent?: string;
  name?: string;
  description?: string;
  display?: (obj: unknown) => string;
  fields: FieldDefinition[];
  constraints?: ConstraintDefinition[];
};

export default class Entity {
  public readonly id: string;
  public readonly parent: Entity;
  public readonly name: string;
  public readonly description: string;
  public readonly display: (obj: unknown) => string;
  public readonly fields: Field[];
  private readonly fieldsById: Map<string, Field>;
  public readonly constraints: Constraint[];

  constructor(definition: EntityDefinition) {
    const validator = new Validator(this);

    this.id = validator.validateId(definition.id);

    const parent = validator.validate(definition.parent, 'parent', { type: 'string' });
    if(parent) {
      this.parent = registry.getEntity(parent);
    }

    this.name = validator.validate(definition.name, 'name', { type: 'string' });
    this.description = validator.validate(definition.description, 'description', { type: 'string' });
    this.display = validator.validate(definition.display, 'display', { type: 'function' });

    const parentFields = this.parent?.fields ?? [];
    const localFields = validator.validate(definition.fields, 'fields', { type: 'array', defaultValue: [] }).map(fdef => new Field(fdef));
    this.fields = [...parentFields, ...localFields];

    const parentConstraints = this.parent ? this.parent.constraints : [];
    const localConstraints = validator.validateConstraints(definition.constraints).map(cdef => new Constraint(cdef));
    this.constraints = [...parentConstraints, ...localConstraints];

    validator.validateUnique(this.fields.map(({ id }) => id), 'fields');
    this.fieldsById = new Map();
    for(const field of this.fields) {
      this.fieldsById.set(field.id, field);
    }

    Object.freeze(this.fieldsById);
    Object.freeze(this.fields);
    Object.freeze(this.constraints);
    lock(this);
  }

  render(object) {
    return this.display(object);
  }

  findField(id: string) {
    return this.fieldsById.get(id);
  }

  getField(id) {
    const field = this.fieldsById.get(id);
    if(field) {
      return field;
    }
    throw new Error(`Field '${id}' not found on entity '${this.id}'`);
  }

  newObject(values = {}) {
    let object = { _entity: this.id };
    for(const field of this.fields) {
      console.log('field', field.name);
      const value = field.getValue(values);
      if(value === undefined) {
        object = field.resetValue(object);
        console.log('reset value', value, field.getValue(object));
      } else {
        object = field.setValue(object, value);
        console.log('set value', value, field.getValue(object));
      }
    }
    return object;
  }

  setValues(object, values) {
    for(const field of this.fields) {
      const value = field.getValue(values);
      if(value === undefined) {
        continue;
      }
      object = field.setValue(object, value);
    }
    return object;
  }
};
