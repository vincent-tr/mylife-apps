'use strict';

import { confirmable, createConfirmation } from 'react-confirm';
import Confirm from './components/confirm';

export function create(Dialog) {
  return createConfirmation(confirmable(Dialog));
}

const confirmDialog = create(Confirm);

const defaultActions = [
  { text: 'Oui', value: true },
  { text: 'Non', value: false }
];

export async function confirm(options) {
  options.actions = options.actions || defaultActions;
  return confirmDialog({ options });
}
