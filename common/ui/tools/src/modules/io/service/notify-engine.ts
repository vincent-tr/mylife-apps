import * as api from '../../../api';
import { Engine, ServiceAPI } from '.';

interface NotifyMessage {
  engine: 'notify';
  view: string;
  list: ViewChangeItem[];
}

export type ViewChangeItem = { type: 'set'; object: api.Entity } | { type: 'unset'; objectId: string };

class NotifyEngine implements Engine {
  constructor(private readonly api: ServiceAPI) {}

  onDisconnect() {}

  onConnect() {}

  onMessage(untypedMessage: unknown) {
    const message = untypedMessage as NotifyMessage;
    const { view: viewId, list } = message;
    this.api.viewChange({ viewId, list });
  }
}

export default NotifyEngine;
