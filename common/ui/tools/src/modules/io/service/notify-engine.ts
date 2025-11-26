import { Entity } from '../../views/types';
import { Engine, ServiceAPI } from '.';

interface NotifyMessage {
  engine: 'notify';
  view: string;
  list: ViewChangeItem[];
}

export type ViewChangeItem = { type: 'set'; object: Entity } | { type: 'unset'; objectId: string };

class NotifyEngine implements Engine {
  constructor(private readonly api: ServiceAPI) {}

  onDisconnect() {}

  onConnect() {}

  onMessage(message: NotifyMessage) {
    const { view: viewId, list } = message;
    this.api.viewChange({ viewId, list });
  }
}

export default NotifyEngine;
