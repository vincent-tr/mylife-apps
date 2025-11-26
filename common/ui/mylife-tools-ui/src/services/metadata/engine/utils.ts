import { ConstraintDefinition } from './constraint';

export function lock(obj) {
  const config = { enumerable: false };
  for (const propName of Object.getOwnPropertyNames(obj)) {
    if (propName.startsWith('_')) {
      Object.defineProperty(obj, propName, config);
    }
  }

  Object.freeze(obj);
}

export class Validator {
  private readonly objectType: string;
  private id: string;
  private objectString: string;

  constructor(obj) {
    this.objectType = obj.constructor.name;
  }

  validateId(id: string) {
    if (!id) {
      throw new Error(`Metadata validation failed: id is mandatory for ${this.objectType}`);
    }

    if (typeof id !== 'string') {
      throw new Error(`Metadata validation failed: id must be 'string' for ${this.objectType}`);
    }

    this.id = id;
    this.objectString = `${this.objectType}(${this.id})`;

    return id;
  }

  validate<T>(value: T, argumentName: string, { type, mandatory = false, defaultValue }: { type: string; mandatory?: boolean; defaultValue?: T }) {
    if (value === null || value === undefined) {
      if (mandatory) {
        throw new Error(`Metadata validation failed: ${argumentName} is mandatory for ${this.objectString}`);
      }

      return defaultValue;
    }

    const matchArray = /^(.*)-array$/.exec(type);
    if (matchArray) {
      const itemType = matchArray[1];

      this.validate(value, argumentName, { type: 'array', mandatory });

      for (const [i, item] of ((value as unknown as unknown[]) || []).entries()) {
        this.validate(item, `${argumentName}[${i}]`, { type: itemType, mandatory: true });
      }

      return value;
    }

    if (getType(value) !== type) {
      throw new Error(`Metadata validation failed: ${argumentName} must be '${type}' for ${this.objectString}`);
    }

    return value;
  }

  validateUnique<T>(list: Iterable<T>, argumentName: string) {
    const uniques = new Set();
    const duplicates = new Set();
    for (const value of list) {
      if (uniques.has(value)) {
        duplicates.add(value);
        continue;
      }

      uniques.add(value);
    }

    if (!duplicates.size) {
      return;
    }

    const duplicatesDisplay = Array.from(duplicates).join(', ');
    throw new Error(`Metadata validation failed: ${argumentName} has duplicates (${duplicatesDisplay}) for ${this.objectString}`);
  }

  validateConstraints(value: ConstraintDefinition[]) {
    return this.validate(value, 'constraints', { type: 'array', defaultValue: [] });
  }
}

function getType(obj: unknown) {
  if (obj instanceof Function) {
    return 'function';
  }
  if (Array.isArray(obj)) {
    return 'array';
  }
  return typeof obj;
}
