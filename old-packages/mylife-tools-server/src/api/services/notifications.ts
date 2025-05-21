import { unnotifyView } from '../..';

export function createUnnotify() {
  return (session, message) => {
    const { viewId } = message;
    return unnotifyView(session, viewId);
  };
}
