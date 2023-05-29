import * as cheerio from 'cheerio/lib/slim'; // Note: parse5 seems to not like webpack packaging
import * as quotedPrintable from 'quoted-printable';
import { BotExecutionContext } from '../api';
import { ImapFlow, FetchMessageObject, downloadBodyPart, mailProcess, flattenNodes } from '../mail-scraper-helper';
import { Amount, Configuration, Item, Receipt, SummaryItem, TransactionItem } from './common';

const CURRENCIES = new Map([
  ['€', 'EUR' ],
  ['$', 'USD' ],
]);

export async function fetch(context: BotExecutionContext, configuration: Configuration) {
  return await mailProcess(context, configuration, async(client, messages) => {
    const recipts: Receipt[] = [];

    for (const message of messages) {
      try {
        recipts.push(await fetchReceipt(client, message));
      }
      catch (err) {
        context.log('error', `Erreur au traitement du mail '${message.uid}' (${message.envelope.date.toLocaleString('fr-fr')}, '${message.envelope.subject}' de '${message.envelope.from[0].address}): ${err.stack}`);
      }
    }

    return recipts;
  });
}

async function fetchReceipt(client: ImapFlow, message: FetchMessageObject) {

  const part = flattenNodes(message.bodyStructure).find(part => part.type === 'text/html');

  if (!part) {
    throw new Error('HTML part not found');
  }

  if (part.encoding !== 'quoted-printable') {
    throw new Error(`Unexpected encoding '${part.encoding}'`);
  }

  const { data } = await downloadBodyPart(client, message, part);
  // quoted-printable decoding + latin1 decoding
  const buffer = Buffer.from(quotedPrintable.decode(data.toString()), 'latin1');
  const content = cheerio.load(data);

  // console.log('ROOT', content.root().toString());
  
  const url = content(`a:contains('Afficher ou gérer le paiement').paypal-button-primary`).attr('href');

  if (!url) {
    throw new Error('Transaction url not found');
  }

  const receipt: Receipt = {
    id: null,
    date: message.envelope.date,
    amount: null,
    mailSubject: message.envelope.subject,
    url,
    transaction: null,
    items: null,
    totals: null,
    sources: null,
  };

  fetchTransaction(content, receipt);
  fetchDetails(content, receipt);

  const paiement = receipt.totals.find(line => line.name === 'Paiement')?.amount;
  const montantConverti = receipt.sources.find(line => line.name === `Montant d'origine`)?.amount;
  if (paiement?.currency === 'EUR') {
    receipt.amount = paiement.value;
  } else if (montantConverti?.currency === 'EUR') {
    receipt.amount = montantConverti.value;
  } else {
    throw new Error('Could not found receipt amount');
  }

  receipt.id = expectOneLine(receipt.transaction.find(it => it.name === 'Numéro de transaction')?.value);
  if (!receipt.id) {
    throw new Error('Could not fetch ID');
  }

  return receipt;
}

function fetchTransaction(content: cheerio.CheerioAPI, receipt: Receipt) {
  const transaction: TransactionItem[] = [];
  const details = content(`table[id='transactionDetails'] td.ppsans > p.ppsans`);

  for (const detail of details) {
    const name = content(`span > :is(strong, b)`, detail).text();
    if (!name) {
      continue;
    }

    // name is first child, then <br>, then all other children are the data
    const data = content(detail).children().filter((index) => index > 1);

    transaction.push({ name, value: readCell(content, data) });
  }

  receipt.transaction = transaction;
}

function fetchDetails(content: cheerio.CheerioAPI, receipt: Receipt) {
  // cartDetails : 3 tables
  // - items
  // - totaux/paiement
  // - sources

  const details = content(`table[id='transactionDetails']`).nextAll();

  const [items, totals, sources] = content(`table[id='cartDetails']`, details).toArray();

  receipt.items = readItemsTable(content, items);
  receipt.totals = readSummaryTable(content, totals);
  receipt.sources = readSummaryTable(content, sources);
}

function readItemsTable(content: cheerio.CheerioAPI, table: cheerio.Element) {
  const [headerContent, ...rowsContent] = content(`tr`, table).toArray();

  const header: string[] = [];
  for (const cell of content(`th`, headerContent)) {
    header.push(readCell(content, content(cell)).join('\n'));
  }

  const expectedHeader = [ 'Description', 'Prix unitaire', 'Qté', 'Montant' ];

  if (header.join('###') !== expectedHeader.join('###')) {
    throw new Error('Unexpected table header');
  }

  const items: Item[] = [];

  for (const rowContent of rowsContent) {
    const row: string[][] = [];

    for (const cell of content(`td`, rowContent)) {
      row.push(readItemCell(content, content(cell)));
    }

    if (row.length !== 4) {
      throw new Error('Unexpected table row length');
    }

    items.push({
      description: row[0],
      unitPrice: parseAmount(expectOneLine(row[1])),
      quantity: parseNumber(expectOneLine(row[2])),
      amount: parseAmount(expectOneLine(row[3]))
    });
  }

  return items;
}

function readSummaryTable(content: cheerio.CheerioAPI, table: cheerio.Element) {
  const rowsContent = content(`tr`, table).toArray();
  const summary: SummaryItem[] = [];

  for (const rowContent of rowsContent) {
    const cells: string[][] = [];

    for (const cell of content(`td`, rowContent)) {
      cells.push(readCell(content, content(cell)));
    }

    if (cells.length !== 2 || cells[0].length === 0 || cells[1].length === 0) {
      // Skip
      continue;
    }

    let name = expectOneLine(cells[0]);
    const amount  = parseAmount(expectOneLine(cells[1]));

    name = name.trimEnd();
    if (name.endsWith(':')) {
      name = name.substring(0, name.length - 1);
    }
    name = name.trimEnd();

    summary.push({ name, amount });
  }

  return summary;
}

function expectOneLine(value: string[]) {
  if (value.length !== 1) {
    throw new Error(`Wrong value one line: ${JSON.stringify(value)}`);
  }

  return value[0];
}

function parseNumber(str: string) {
  if (!str) {
    throw new Error('Empty value');
  }

  const value = Number.parseInt(str, 10);
  if (isNaN(value)) {
    throw new Error('unexpected number');
  }

  return value;
}

function parseAmount(str: string): Amount {
  if (!str) {
    throw new Error('Empty value');
  }

  const prefix = str.at(0);
  const [amount, currency] = str.substring(1).trim().split(' ');

  if (CURRENCIES.get(prefix) !== currency) {
    throw new Error(`Unknown currency '${prefix}', '${currency}'`);
  }

  const value = Number.parseFloat(amount.replace(',', '.'));
  if (isNaN(value)) {
    throw new Error(`Unexpected amount value '${amount}'`);
  }

  return { value, currency };
}

function readCell(content: cheerio.CheerioAPI, data: cheerio.Cheerio<cheerio.Element>) {
  const selection = [];
  for (const item of data) {
    if (item.tagName === 'span') {
      selection.push(content(item));
    } else {
      selection.push(content(`span`, item));
    }
  }

  // join all spans together
  const html = selection.map(item => content(item).html()).join('');
  // split rows and extract text
  return html.split('<br>').map(html => cheerio.load(html).text()).filter(x => x);
}

function readItemCell(content: cheerio.CheerioAPI, data: cheerio.Cheerio<cheerio.Element>) {
  // description is 2 nested spans possibly repeated with br, other cols only one span

  const items = data.children().toArray();

  if (items.length < 2) {
    return readCell(content, data);
  }

  return content(`span > span`, data).toArray().map(line => content(line).text()).filter(x => x);
}
