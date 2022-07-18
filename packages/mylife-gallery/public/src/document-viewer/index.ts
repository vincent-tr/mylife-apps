'use strict';

import { dialogs } from 'mylife-tools-ui';
import Dialog from './components/dialog';

const dialog = dialogs.create(Dialog);

export async function showDialog(documentType, documentId, { onPrev = null, onNext = null, canPrev = false, canNext = false } = {}) {
  await dialog({ options: { documentType, documentId, onPrev, onNext, canPrev, canNext } });
}
