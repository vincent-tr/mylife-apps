import { dialogs } from 'mylife-tools-ui';
import Dialog from './components/dialog';

const dialog = dialogs.create(Dialog);

interface DialogCallbacks {
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: () => boolean;
  canNext?: () => boolean;
}

export async function showDialog(documentType, documentId: string, { onPrev, onNext, canPrev, canNext }: DialogCallbacks = {}) {
  await dialog({ options: { documentType, documentId, onPrev, onNext, canPrev, canNext } });
}
