'use strict';

import { viewChange } from '../actions';

class NotifyEngine {
  constructor(emitter, dispatch) {
    this.emitter = emitter;
    this.dispatch = dispatch;
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
