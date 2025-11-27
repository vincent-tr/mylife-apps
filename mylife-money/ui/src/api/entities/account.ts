import { api } from 'mylife-tools';

/** Compte bancaire */
export interface Account extends api.Entity {
  _entity: 'account';
  /** Code du compte */
  code: string;
  /** Nom d'affichage */
  display: string;
}
