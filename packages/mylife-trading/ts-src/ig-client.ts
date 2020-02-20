// from https://github.com/schopenhauer/ig-markets/blob/master/lib/ig.js

import rest from 'restler';

const REAL_API = 'https://api.ig.com/gateway/deal/';
const DEMO_API = 'https://demo-api.ig.com/gateway/deal/';
const MAX_REQUEST_ATTEMPTS = 4;

class IgClient {
  private readonly api: string;
  private token: string = null;
  private cst: string = null;

  /**
   * Constructor
   *
   * @param key Your IG Markets account key.
   * @param identifier Your IG Markets username.
   * @param password Your IG Markets password.
   * @param isDemo Flag if this is demo account
   */
  constructor(
    private readonly key: string,
    private readonly identifier: string,
    private readonly password: string,
    isDemo: boolean
  ) {
    if (!this.key || !this.identifier || !this.password) {
      throw new Error('key, identifier and password are required');
    }

    this.api = isDemo ? DEMO_API : REAL_API;
  }

  /**
   * Make a HTTP(S) request.
   *
   * @param method The HTTP method used.
   * @param action The action path appended to URL.
   * @param data The data passed to HTTP request.
   * @param version The version number passed to header.
   */
  async request(
    method: string,
    action: string,
    data: any = null,
    version: string = '2'
  ) {
    if (!['post', 'get'].includes(method)) {
      new Error('Error: HTTP method not defined, please review API call');
    }

    for(let attempt =0; attempt < MAX_REQUEST_ATTEMPTS; ++attempt) {
      try {
        return await new Promise((resolve, reject) => {
          const headers = this.getHeaders(version);
          const url = this.api + action;
          const request = method === 'post' ? rest.postJson : rest.json;
  
          request(url, data, { headers })
            .on('complete', (data, res) => {
              data.res = res;
              resolve(data);
            })
            .on('error', reject);
        });
      } catch (e) {
        attempt++;
        if (attempt >= MAX_REQUEST_ATTEMPTS) {
          console.error(
            `ERROR: Action "${action}" has been reattempted too many times.`
          );
        }
        // error so try again
        console.log(
          `REQUEST ${action} FAILED, RETRYING ${attempt}/${MAX_REQUEST_ATTEMPTS}`
        );
        await wait(500);
      }
    }

    function wait(ms: number) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  }

  /**
   * Creates a trading session, obtaining session tokens for subsequent API access
   * @returns {Promise.<void>}
   */
  async login() {
    const credentials = {
      identifier: this.identifier,
      password: this.password,
      encryptedPassword: null // TODO: encryptedPassword: true
    };

    const data = await this.request('post', 'session', credentials);
    this.cst = data.res.headers['cst'];
    this.token = data.res.headers['x-security-token'];
  }

  /**
   * @param version
   * @returns {{Content-Type: string, Accept: string, Version: *, X-IG-API-KEY: (string|*), X-SECURITY-TOKEN: (null|*|string), CST: (*|null|string)}}
   */
  getHeaders(version: string) {
    return {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json; charset=UTF-8',
      Version: version,
      'X-IG-API-KEY': this.key,
      'X-SECURITY-TOKEN': this.token || '',
      CST: this.cst || ''
    };
  }
}
