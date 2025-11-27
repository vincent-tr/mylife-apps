import { api } from 'mylife-tools';

export type RuleOperator = '$eq' | '$gt' | '$gte' | '$lt' | '$lte' | '$regex' | '$contains';

/** Condition de règle */
export interface Condition {
  /** Champ */
  field: string;
  /** Opérateur */
  operator: RuleOperator;
  /** Valeur (string ou number) */
  value: any;
}

/** Règle de catégorisation */
export interface Rule {
  /** Nom de la règle */
  name: string;
  /** Conditions */
  conditions: Condition[];
}

/** Groupe de catégorisation */
export interface Group extends api.Entity {
  _entity: 'group';
  /** Groupe parent - référence à Group._id */
  parent: string | null;
  /** Nom d'affichage */
  display: string;
  /** Règles de catégorisation */
  rules: Rule[];
}
