'use strict';

import { dialogs } from 'mylife-tools-ui';
import Dialog from './dialog';

export * from './utils';

const dialog = dialogs.create(Dialog);

export async function showDialog(document) {
  await dialog({ options: { document } });
}
