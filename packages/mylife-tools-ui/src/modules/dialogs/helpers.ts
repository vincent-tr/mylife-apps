'use strict';

import React from 'react';
import { confirmable, createConfirmation } from 'react-confirm';
import Confirm from './components/confirm';
import Input from './components/input';
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

const defaultConfirmActions = [
  { text: 'Oui', value: true },
  { text: 'Non', value: false }
];

export async function confirm(options) {
  options.actions = options.actions || defaultConfirmActions;
  return confirmDialog({ options });
}

const inputDialog = create(Input);

export async function input(options) {
  return inputDialog({ options });
}
