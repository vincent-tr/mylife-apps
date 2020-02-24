import { LightstreamerClient, SimpleLoggerProvider, ConsoleAppender } from 'lightstreamer-client';

// https://labs.ig.com/lightstreamer-downloads
// https://www.npmjs.com/package/lightstreamer-client/v/6.2.6
// https://www.lightstreamer.com/repo/distros/Lightstreamer_Allegro-Presto-Vivace_6_0_1_20150730.zip%23/Lightstreamer/DOCS-SDKs/sdk_client_javascript/doc/API-reference/index.html

// const prov = new SimpleLoggerProvider();
// prov.addLoggerAppender(new ConsoleAppender('DEBUG', null));
// LightstreamerClient.setLoggerProvider(prov);

export default class Stream {
  private readonly lsClient: typeof LightstreamerClient;

  constructor(endpoint: string, activeAccountId: string, cst: string, token: string) {
    this.lsClient = new LightstreamerClient(endpoint);

    const { connectionDetails } = this.lsClient;
    console.log(endpoint, activeAccountId, cst, token);
    connectionDetails.setUser(activeAccountId);
    connectionDetails.setPassword(`CST-${cst}|XST-${token}`);

    this.lsClient.addListener({
      onListenStart: function () {
        console.log('ListenStart');
      },
      onStatusChange: function (status: any) {
        console.log('Lightstreamer connection status:' + status);
      }
    });

    // Connect to Lightstreamer
    this.lsClient.connect();
  }

  terminate() {
    this.lsClient.disconnect();
  }
}
