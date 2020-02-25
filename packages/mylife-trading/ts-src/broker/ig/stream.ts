import EventEmitter from 'events';
import { LightstreamerClient, Subscription, SimpleLoggerProvider, ConsoleAppender } from 'lightstreamer-client';

// https://labs.ig.com/lightstreamer-downloads
// https://www.npmjs.com/package/lightstreamer-client/v/6.2.6
// https://www.lightstreamer.com/repo/distros/Lightstreamer_Allegro-Presto-Vivace_6_0_1_20150730.zip%23/Lightstreamer/DOCS-SDKs/sdk_client_javascript/doc/API-reference/index.html

// const prov = new SimpleLoggerProvider();
// prov.addLoggerAppender(new ConsoleAppender('DEBUG', null));
// LightstreamerClient.setLoggerProvider(prov);

export declare interface StreamSubscription {
  on(event: 'subscribed', listener: () => void): this;
  on(event: 'unsubscribed', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'update', listener: (data: any) => void): this;
}

export class StreamSubscription extends EventEmitter {
  constructor(private readonly lsClient: typeof LightstreamerClient, private readonly subscription: typeof Subscription) {
    super();

    subscription.addListener({
      onSubscription: () => {
        this.emit('subscribed');
      },
      onUnsubscription: () => {
        this.emit('unsubscribed');
      },
      onSubscriptionError: (code: string, message: string) => {
        this.emit('error', new Error(`subscription failure: ${code} message: ${message}`));
      },
      onItemUpdate: (updateInfo: any) => {
        const data: any = {};
        updateInfo.forEachField((fieldName: string, fieldPos: number, value: string) => {
          data[fieldName] = value ? JSON.parse(value) : null;
        });
        this.emit('update', data);
      }
    });
  }

  close() {
    this.lsClient.unsubscribe(this.subscription);
  }
}

export default class Stream {
  private readonly lsClient: typeof LightstreamerClient;

  constructor(endpoint: string, activeAccountId: string, cst: string, token: string) {
    this.lsClient = new LightstreamerClient(endpoint);

    const { connectionDetails } = this.lsClient;
    console.log(endpoint, activeAccountId, cst, token);
    connectionDetails.setUser(activeAccountId);
    connectionDetails.setPassword(`CST-${cst}|XST-${token}`);

    this.lsClient.addListener({
      onStatusChange: function (status: any) {
        // TODO: logging
        console.log('Lightstreamer connection status:' + status);
      }
    });

    // Connect to Lightstreamer
    this.lsClient.connect();
  }

  terminate() {
    this.lsClient.disconnect();
  }

  createSubscription(subscriptionMode: string, items: string[], fields: string[]): StreamSubscription {
    const subscription = new Subscription(subscriptionMode, items, fields);
    this.lsClient.subscribe(subscription);
    return new StreamSubscription(this.lsClient, subscription);
  }
}
