'use strict';

import { viewSet, viewUnset } from '../actions';

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
    const { type, view: viewId } = message;
    switch(type) {
      case 'set':
        this.dispatch(viewSet({ viewId, object: message.object }));
        break;

      case 'unset':
        this.dispatch(viewUnset({ viewId, objectId: message.objectId }));
        break;

      default:
        console.log(`Message with unknown notification type '${message.type}', ignored`);
        break;
    }
  }
}

export default NotifyEngine;
