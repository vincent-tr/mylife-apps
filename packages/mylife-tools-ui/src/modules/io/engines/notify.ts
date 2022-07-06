import { viewChange } from '../actions';

class NotifyEngine {
  constructor(private readonly emitter, private readonly dispatch) {
  }

  onDisconnect() {
  }

  onConnect() {
  }

  onMessage(message) {
    const { view: viewId, list } = message;
    this.dispatch(viewChange({ viewId, list }));
  }
}

export default NotifyEngine;
