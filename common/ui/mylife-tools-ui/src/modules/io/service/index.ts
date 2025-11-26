import io, { Socket } from 'socket.io-client';
import * as serializer from '../serializer';
import CallEngine from './call-engine';
import NotifyEngine, { ViewChangeItem } from './notify-engine';

export interface ViewChange {
  viewId: string;
  list: ViewChangeItem[];
}

export interface ServiceAPI {
  setOnline(online: boolean): void;
  setBusy(busy: boolean): void;
  viewChange(changes: ViewChange): void;
}

export interface Engine {
  onConnect(): void;
  onDisconnect(): void;
  onMessage(message: any): void;
}

export class Service {
  private readonly socket: Socket;
  private readonly engines: { call: CallEngine; notify: NotifyEngine };

  constructor(private readonly api: ServiceAPI) {
    this.socket = io({ transports: ['websocket', 'polling'] });
    const emitter = (message: any) => this.socket.emit('message', serializer.serialize(message));

    this.engines = {
      call: new CallEngine(emitter, api),
      notify: new NotifyEngine(api),
    };

    this.socket.on('connect', () => {
      for (const engine of Object.values(this.engines)) {
        engine.onConnect();
      }

      this.api.setOnline(true);
    });

    this.socket.on('disconnect', (reason) => {
      this.api.setOnline(false);
      for (const engine of Object.values(this.engines)) {
        engine.onDisconnect();
      }

      // failure on network === 'transport closed'
      if (reason === 'io server disconnect') {
        // need to reconnect manually
        this.socket.connect();
      }
    });

    this.socket.on('message', (payload) => {
      const message = serializer.deserialize(payload);
      const engine = this.engines[message.engine];
      if (!engine) {
        console.log(`Message with unknown engine '${message.engine}', ignored`);
        return;
      }

      engine.onMessage(message);
    });
  }

  async executeCall(message: any) {
    return await this.engines.call.executeCall(message);
  }
}
