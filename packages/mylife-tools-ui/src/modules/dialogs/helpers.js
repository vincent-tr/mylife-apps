'use strict';

import React from 'react';
import { confirmable, createConfirmation } from 'react-confirm';
import Confirm from './components/confirm';
import { ToolsProvider } from '../../components/application';

export function create(Dialog) {

  const DialogWrapper = (props) => (
    <ToolsProvider>
      <Dialog {...props} />
    </ToolsProvider>
  );

  return createConfirmation(confirmable(DialogWrapper));
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
