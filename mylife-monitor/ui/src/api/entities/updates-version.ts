import { api } from 'mylife-tools';
import type { UpdatesStatus } from './datatypes';

/** Version */
export interface UpdatesVersion extends api.Entity {
  _entity: 'updates-version';
  /** Chemin */
  path: string[];
  /** État */
  status: UpdatesStatus;
  /** Version courante */
  currentVersion: string;
  /** Date de création (courante) */
  currentCreated: Date;
  /** Dernière version */
  latestVersion: string;
  /** Date de création (dernière) */
  latestCreated: Date;
}
