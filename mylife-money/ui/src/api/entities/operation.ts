import { api } from 'mylife-tools';

/** Opération bancaire */
export interface Operation extends api.Entity {
  _entity: 'operation';
  /** Date de l'opération */
  date: Date;
  /** Montant */
  amount: number;
  /** Libellé */
  label: string;
  /** Compte - référence à Account._id */
  account: string;
  /** Groupe - référence à Group._id */
  group: string | null;
  /** Note */
  note: string;
}

export interface OperationViewCriteria {
  minDate: Date;
  maxDate: Date | null;
  account: string | null;
  group: string | null;
  lookupText: string | null;
}
