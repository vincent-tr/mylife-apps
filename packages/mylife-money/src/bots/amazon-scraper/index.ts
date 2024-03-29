import { createLogger } from 'mylife-tools-server';
import { BotExecutionContext } from '../api';
import * as business from '../../business';
import { Configuration, Order } from './common';
import { fetch } from './fetcher';
import { selectOperations } from '../mail-scraper-helper';

type FIXME_any = any;
type Operation = FIXME_any;

const logger = createLogger('mylife:money:bots:amazon-scraper');

export default async function (context: BotExecutionContext) {
  const configuration = context.configuration as Configuration;

  if (!configuration.imapServer || !configuration.imapUser || !configuration.imapPass
    || !configuration.mailbox || !configuration.from || !configuration.sinceDays
    || !configuration.account || !configuration.matchDaysDiff || !configuration.matchLabel
    || !configuration.template) {
    throw new Error('Missing configuration');
  }

  const orders = await fetch(context, configuration);
  const operations = selectOperations(orders, configuration);
  let updatedCount = 0;
  
  for (const order of orders) {
    context.log('debug', `Traitement de la commande '${order.id}' du '${order.date.toLocaleString('fr-fr')}'`);
    if (processOrderMatch(context, configuration, operations, order)) {
      ++updatedCount;
    }
  }

  context.log('info', `${updatedCount} opérations mises à jour`);

  const movedCount = business.executeRules();
  context.log('info', `Exécution des règles : ${movedCount} opérations classées`);
}

function processOrderMatch(context: BotExecutionContext, configuration: Configuration, operations: Operation[], order: Order) {
  const labelMatch = createLabelMatcher(configuration, order);
  const matches = operations.filter(op => (op.amount === -order.amount && diffDays(op.date, order.date) <= configuration.matchDaysDiff) && labelMatch(op));

  // With date match, should have found at most one match
  switch (matches.length) {
  case 0:
    context.log('debug', 'Pas de correspondance trouvée.')
    return false;

  case 1:
    break;

  default:
    context.log('error', 'Plusieurs correspondances trouvées !')
    return false;
  }

  const operation = matches[0];

  const newNote = formatNote(configuration, order);
  
  if ((operation.note || '').includes(newNote)) {
    context.log('debug', 'Correspondance trouvée, mais notes déjà présente. Rien à faire.');
    return false;
  }
  
  context.log('info', 'Correspondance trouvée, ajout des notes.');
  business.operationAppendNote(newNote, operation._id);

  return true;
}

function diffDays(date1: Date, date2: Date) {
  const diff = Math.abs(date1.valueOf() - date2.valueOf());
  return diff / (1000 * 60 * 60 * 24);
}

function createLabelMatcher(configuration: Configuration, order: Order) {
  // eg: March 6th = '0603'
  const date = formatTwoDigits(order.date.getDate()) + formatTwoDigits(order.date.getMonth() + 1);
  const regexp = new RegExp(configuration.matchLabel.replace('{date}', date));

  return (operation: Operation) => regexp.test(operation.label || '');
}

function formatTwoDigits(number: number) {
  return number.toLocaleString(undefined, { minimumIntegerDigits: 2 });
}

function formatNote(configuration: Configuration, order: Order) {
  return configuration.template.replace('{metadata}', formatMetadata(order));
}

function formatMetadata(order: Order) {
  const lines = [
    `[${order.id}](${order.orderUrl}) le ${order.date.toLocaleDateString('fr-FR')}`,
    '',
    '| | Produit | Qté | P.U. (EUR) |',
    '| - | - | - | - |',
  ];

  for (const item of order.items) {
    lines.push(`| [![img](${item.imageUrl})](${item.productUrl}) | [${item.description}](${item.productUrl}) | ${item.quantity} | ${item.unitPrice}`);
  }

  return lines.join('\n');
}
