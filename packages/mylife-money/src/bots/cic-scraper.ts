import { setTimeout } from 'node:timers/promises';
import axios, { AxiosHeaders, AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { CookieJar, CookieAccessInfo } from 'cookiejar';
import * as cheerio from 'cheerio/lib/slim'; // Note: parse5 seems to not like webpack packaging
import { createLogger } from 'mylife-tools-server';
import { BotExecutionContext } from './api';
import * as business from '../business';

const logger = createLogger('mylife:money:bots:cic-scraper');

interface Configuration {
  user: string;
  pass: string;
  account: string; // account in Money
}

interface State {
  agent: string[];
  lastDownload: {
    date: Date,
    content: string,
  }
}

export default async function (context: BotExecutionContext) {
  const agent = new Agent(context.signal);

  const configuration = context.configuration as Configuration;
  const state = { ...context.state } as State; // prepare already a new state to save it

  const { user, pass, account } = configuration;
  if (!user || !pass || !account) {
    throw new Error('Missing configuration');
  }

  if (state.agent) {
    logger.debug('load agent state');
    agent.load(state.agent);
  }

  let content: string;
  try {
    await authenticate(context, agent, user, pass);
    content = await download(context, agent);
  } finally {
    // save anyway, event if we fail download or whatever
    logger.debug('save agent state');
    state.agent = agent.save();
    context.setState(state);
  }

  state.lastDownload = { date: new Date(), content };
  context.setState(state);

  const count = business.operationsImport(account, content);
  context.log('info', `${count} opérations importées`);
}

async function authenticate(context: BotExecutionContext, agent: Agent, user: string, pass: string) {
  
  const authUrl = 'https://www.cic.fr/fr/authentification.html';
  const accueilUrl = 'https://www.cic.fr/fr/banque/pageaccueil.html?referer=paci';
  const validationUrl = 'https://www.cic.fr/fr/banque/validation.aspx';

  await agent.exec({ url: authUrl, method: 'GET' });
  const responseValidation = await agent.exec({
    url: authUrl,
    method: 'POST',
    formData: { _cm_user: user, _cm_pwd: pass, flag: 'password', _charset_: 'UTF-8' }
  });

  switch(responseValidation.config.url) {
    case accueilUrl:
      // Auth OK
      return;

    case validationUrl:
      // need mobile confirmation
      break;

      default:
        throw new Error(`Wrong target: '${responseValidation.config.url}'`);
  }

  const transactionId = findJsValue(responseValidation.data, 'transactionId');
  const getTransactionValidationStateUrl = findJsValue(responseValidation.data, 'getTransactionValidationStateUrl');

  // console.log('transactionId', transactionId);
  // console.log('getTransactionValidationStateUrl', getTransactionValidationStateUrl);

  const content = cheerio.load(responseValidation.data);

  // on cherche les info sur le moyen pour valider
  const validator = content(`div[id='C:O:B:I1:inMobileAppMessage']`).children(`h2[class*='otpFontSizeIncreased']`).children('span').text();
  context.log('info', `Authentification forte requise : ${validator}`);

/*
<div id="C:O:B:I1:inMobileAppMessage" class="inMobileAppDescription">
<h2 class="_c1 c otpFontSizeIncreased _c1">
<span>Démarrez votre application mobile depuis votre appareil "<strong>PIXEL 6 PRO DE M TRUMPFF VINCENT</strong>" pour vérifier et confirmer votre identité.
</span>
</h2><br /><br /><img height="200px" alt="" src="https://cdnii.e-i.com/SOSD/sd/otp/1.1.5/images/validation_operation.gif" class="_c1 c otpInAppGif _c1" style="display:block; margin-left:auto; margin-right:auto;" /> <span></span>
</div>
*/

  const form = content(`form[id='C:P:F']`);
  const action = decodeURIComponent(form.attr('action') || '');
  const formData: Record<string, string> = {};

  for (const elem of form.find(`input[type=hidden]`).toArray()) {
    formData[elem.attribs.name] = elem.attribs.value;
  }

  // note: is we miss that it seems to fail ..
  formData['_FID_DoValidate.x'] = '0';
  formData['_FID_DoValidate.y'] = '0';

  // console.log('ACTION', action);
  // console.log('FORM DATA', formData); 

  let exitLoop = false;
  while (true) {
    const responseState = await agent.exec({ url: getTransactionValidationStateUrl, method: 'POST', formData: { transactionId } });
    // console.log(responseState.data);
    // <root><code_retour>0000</code_retour><transactionState>PENDING</transactionState></root>
    // <root><code_retour>0000</code_retour><transactionState>VALIDATED</transactionState></root>

    const status = match(/<root><code_retour>0000<\/code_retour><transactionState>([A-Z]*)<\/transactionState><\/root>/, responseState.data);

    switch(status) {
    case 'PENDING':
      context.log('info', `En attente d'authentification`);
      break;

    case 'VALIDATED':
      context.log('info', 'Authentification validée');
      exitLoop = true;
      break;

    default:
      throw new Error(`Unexpected status '${status}'`);
    }

    if (exitLoop) {
      break;
    }
  
    await setTimeout(5000, null, { signal: context.signal });
  }

  const responseAccueil = await agent.exec({ url: `https://www.cic.fr${action}`, method: 'POST', formData, referer: validationUrl });

  if (responseAccueil.config.url !== accueilUrl) {
    throw new Error(`Wrong target: '${responseAccueil.config.url}'`);
  }
}

async function download(context: BotExecutionContext, agent: Agent) {
  const MAX_RETRIES = 10;
  const url = 'https://www.cic.fr/fr/banque/compte/telechargement.cgi';

  for (let retry = 0;; ++retry) {

    const responseTelechargement = await agent.exec({ url, method: 'GET' });

    const content = cheerio.load(responseTelechargement.data);

    const form = content(`form[id='P1:F']`);
    const action = decodeURIComponent(form.attr('action') || '');
    const cpt = form.find(`input[name='_CPT']`).first().attr('value');

    const formData: Record<string, string> = {};

    // picked from Chrome session dev tools
    formData['data_formats_selected'] = 'csv';
    formData['data_formats_options_cmi_download'] = '0';
    formData['data_formats_options_ofx_format'] = '7';
    formData['Bool:data_formats_options_ofx_zonetiers'] = 'false';
    formData['CB:data_formats_options_ofx_zonetiers'] = 'on';
    formData['data_formats_options_qif_fileformat'] = '6';
    formData['data_formats_options_qif_dateformat'] = '0';
    formData['data_formats_options_qif_amountformat'] = '0';
    formData['data_formats_options_qif_headerformat'] = '0';
    formData['Bool:data_formats_options_qif_zonetiers'] = 'false';
    formData['CB:data_formats_options_qif_zonetiers'] = 'on';
    formData['data_formats_options_csv_fileformat'] = '2';
    formData['data_formats_options_csv_dateformat'] = '0';
    formData['data_formats_options_csv_fieldseparator'] = '0';
    formData['data_formats_options_csv_amountcolnumber'] = '1';
    formData['data_formats_options_csv_decimalseparator'] = '0';
    formData['Bool:data_accounts_account_ischecked'] = 'true';
    formData['CB:data_accounts_account_ischecked'] = 'on';
    formData['Bool:data_accounts_account_2__ischecked'] = 'false';
    formData['Bool:data_accounts_account_3__ischecked'] = 'false';
    formData['Bool:data_accounts_account_4__ischecked'] = 'false';
    formData['Bool:data_accounts_account_5__ischecked'] = 'false';
    formData['Bool:data_accounts_account_6__ischecked'] = 'false';
    formData['data_daterange_value'] = 'all';
    formData['_FID_DoDownload.x'] = '65';
    formData['_FID_DoDownload.y'] = '17';
    formData['data_accounts_selection'] = '100000000000';
    formData['data_formats_options_cmi_show'] = 'True';
    formData['data_formats_options_qif_show'] = 'True';
    formData['data_formats_options_excel_show'] = 'True';
    formData['data_formats_options_csv_show'] = 'True';
    formData['[t:dbt%3adate;]data_daterange_startdate_value'] = '';
    formData['[t:dbt%3adate;]data_daterange_enddate_value'] = '';

    // The only custom
    formData['_CPT'] = cpt || '';

    const response = await agent.exec({
      url: `https://www.cic.fr${action}`,
      method: 'POST',
      formData,
      referer: url,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    });

    const contentDisposition = response.headers['content-disposition'] || '';
    const isResponseOk = contentDisposition.startsWith('attachment');

    if (isResponseOk) {
      const data = response.data;

      logger.info(`downloaded file of ${data.length} bytes`);
      context.log('info', `Téléchargé un fichier de ${data.length} octets`);
      return data;
    }

    if (retry < MAX_RETRIES) {
      context.log('info', `Mauvais type de réponse, nouvelle tentative dans 5 secondes (essai ${retry})`);
      logger.info(`Unexpected response, expected attachment (try ${retry})`);
      await setTimeout(5000, null, { signal: context.signal });
      continue;
    }

    break;
  }

  throw new Error(`Unexpected response, expected attachment after ${MAX_RETRIES} retries`);
}

function findJsValue(data: string, key: string) {
  const rx = new RegExp(`${key}: '([^']*)'`);
  const res = rx.exec(data);

  const value = res && res[1];
  if (!value) {
    throw new Error(`Value not found for key '${key}'`);
  }

  return value;
}

function match(rx: RegExp, data: string) {
  const res = rx.exec(data);

  const value = res && res[1];
  if (!value) {
    throw new Error('No match');
  }

  return value;

}

type FormData = Record<string, string> | URLSearchParams;

interface ExecParams {
  url: string;
  method: string;
  formData?: FormData;
  referer?: string;
  accept?: string;
}

class Agent {
  private readonly jar = new CookieJar();

  constructor(private readonly signal: AbortSignal) {
    this.jar.setCookie('lastCnx=password;');
    // accept cookies
    this.jar.setCookie(`eu-consent=%7B%22%2Ffr%2F%22%3A%7B%22solutions%22%3A%7B%22googleAnalytics%22%3Afalse%2C%22ABTasty%22%3Afalse%2C%22uxcustom%22%3Afalse%2C%22DCLIC%22%3Afalse%2C%22googleMarketingPlatform%22%3Afalse%2C%22youtube%22%3Afalse%2C%22ivs%22%3Afalse%7D%2C%22expireDate%22%3A%222023-07-11T09%3A49%3A11.588Z%22%7D%7D;`);
  }

  load(value: string[]) {
    for (const cookiestr of value) {
      this.jar.setCookie(cookiestr);
    }
  }

  save() {
    return this.jar.getCookies(CookieAccessInfo.All).map(cookie => cookie.toString());
  }

  async exec({ url, method, formData, referer, accept }: ExecParams): Promise<AxiosResponse> {
    logger.debug(`request: ${method} ${url}`);
    const cookie = this.jar.getCookies(CookieAccessInfo.All).toValueString();

    const headers = new AxiosHeaders();
    headers.set('Cookie', cookie);

    const options: AxiosRequestConfig = { url, method, headers };

    if (formData) {
      headers.setContentType('application/x-www-form-urlencoded');
      const params = new URLSearchParams(formData);
      options.data = params.toString();
    }

    if (referer) {
      headers.set('Referer', referer);
    }

    if (accept) {
      headers.setAccept(accept);
    }

    const response = await this.request(options);
    this.jar.setCookies(response.headers['set-cookie'] || []);
    
    // console.log('REQUEST HEADERS');
    // console.log(response.request.getHeaders());
    // console.log('---');
    logger.debug(`response: ${response.status} ${response.statusText}`);
    // console.log(response.status, response.statusText);
    // console.log('RESPONSE HEADERS');
    // console.log(response.headers);
    // console.log('---');
    // console.log(this.jar.getCookies(CookieAccessInfo.All).toValueString());

    if (response.status === 302) {
      logger.debug(`response redirect`);
      const url = (response.headers as AxiosHeaders).get('location') as string;
      return await this.exec({ url, method: 'GET' });
    }

    return response;
  }

  private async request(options: AxiosRequestConfig) {
    try {
      return await axios.request({ ...options, maxRedirects: 0, signal: this.signal });
    } catch(err: any) {
      if (err instanceof AxiosError) {
        const aerr = err as AxiosError;

        // failed because of redirect, let's handle it
        if (aerr.response?.status === 302) {
          return err.response as AxiosResponse;
        }
      }

      throw err;
    }
  }
}
