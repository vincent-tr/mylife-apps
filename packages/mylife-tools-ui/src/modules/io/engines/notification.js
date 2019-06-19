'use strict';

import { utils } from 'mylife-tools-common';

class NotificationEngine {
  constructor(emitter, dispatch) {
    this.emitter = emitter;
    this.dispatch = dispatch;
  }

  onDisconnect() {
  }

  onConnect() {
  }

  onMessage(message) {
  }
}

export default NotificationEngine;
