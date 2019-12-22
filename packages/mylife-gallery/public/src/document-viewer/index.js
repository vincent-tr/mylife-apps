'use strict';

import { dialogs } from 'mylife-tools-ui';
import Dialog from './components/dialog';

const dialog = dialogs.create(Dialog);

export async function showDialog(viewId, documentId) {
  await dialog({ options: { viewId, documentId } });
}
