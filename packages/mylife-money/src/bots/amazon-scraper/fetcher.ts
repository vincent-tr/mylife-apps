import * as cheerio from 'cheerio/lib/slim'; // Note: parse5 seems to not like webpack packaging
import { BotExecutionContext } from '../api';
import { ImapFlow, FetchMessageObject, downloadBodyPart, mailProcess } from '../mail-scraper-helper';
import { Configuration, Order } from './common';

export async function fetch(context: BotExecutionContext, configuration: Configuration) {
  return await mailProcess(context, configuration, async(client, messages) => {
    const orders: Order[] = [];

    for (const message of messages) {
      try {
        orders.push(await fetchOrder(client, message));
      }
      catch (err) {
        context.log('error', `Erreur au traitement du mail '${message.uid}' (${message.envelope.date.toLocaleString('fr-fr')}, '${message.envelope.subject}' de '${message.envelope.from[0].address}): ${err.stack}`);
      }
    }

    return orders;
  });
}

async function fetchOrder(client: ImapFlow, message: FetchMessageObject) {

  const part = message.bodyStructure.childNodes.find(part => part.type === 'text/html');

  if (!part) {
    throw new Error('HTML part not found');
  }

  const { data } = await downloadBodyPart(client, message, part);
  const content = cheerio.load(data);

  //console.log(content.root().html());

  const id = parseText(content(`table[id='header'] td[class='title'] > a`).text());
  const amount = parseAmount(content(`table[id='criticalInfo'] table[id='criticalInfo-costBreakdown'] td[class='total-value'] > strong`).text());

  const order: Order = {
    id,
    date: message.envelope.date,
    orderUrl: `https://www.amazon.fr/gp/your-account/order-details/ref?orderID=${id}`,
    amount,
    items: []
  };

  const items = content(`table[id='itemDetails'] tr`);
  for (const item of items) {

    const { description, quantity } = parseDescription(content(`td[class='name'] a`, item).html());
    order.items.push({
      productUrl: parseAttr(new URL(content(`td[class='name'] a`, item).attr('href')).searchParams.get('U').split('/ref=')[0]),
      imageUrl: parseAttr(content(`td[class='photo'] img`, item).attr('src')),
      unitPrice: parseAmount(content(`td[class='price'] > strong`, item).text()),
      description,
      quantity
    })
  }

  return order;
}

function parseAmount(str: string) {
  if (!str) {
    throw new Error('Empty value');
  }

  const [currency, value] = str.trim().split(' ');
  if (currency !== 'EUR') {
    throw new Error('unexpected currency');
  }

  const amount = Number.parseFloat(value.replace(',', '.'));
  if (isNaN(amount)) {
    throw new Error('unexpected amount');
  }

  return amount;
}

function parseAttr(str: string) {
  if (!str) {
    throw new Error('Empty value');
  }

  return str;
}

function parseText(str: string) {
  if (!str) {
    throw new Error('Empty value');
  }

  return str.trim();
}

function parseDescription(str: string) {
  if (!str) {
    throw new Error('Empty value');
  }

  str = str.trim();

  if (str.startsWith('<b>')) {
    // contains quantity
    str = str.substring('<b>'.length);
    const [ quantityStr, descriptionStr ] = str.split('</b>');
    const quantity = Number.parseInt(quantityStr.trim(), 10);
    if (isNaN(quantity)) {
      throw new Error('Could not get quantity');
    }

    return { description: descriptionStr.trimStart(), quantity };
  } else {
    // no quantity => 1
    return { description: str, quantity: 1 };
  }
}