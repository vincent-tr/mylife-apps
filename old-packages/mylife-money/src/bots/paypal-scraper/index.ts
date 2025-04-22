import { createLogger } from 'mylife-tools-server';
import { BotExecutionContext } from '../api';
import * as business from '../../business';
import { Amount, Configuration, Receipt } from './common';
import { fetch } from './fetcher';
import { selectOperations } from '../mail-scraper-helper';

type FIXME_any = any;
type Operation = FIXME_any;

const logger = createLogger('mylife:money:bots:paypal-scraper');

export default async function (context: BotExecutionContext) {
  const configuration = context.configuration as Configuration;

  if (!configuration.imapServer || !configuration.imapUser || !configuration.imapPass
    || !configuration.mailbox || !configuration.from || !configuration.sinceDays
    || !configuration.account || !configuration.matchDaysDiff || !configuration.matchLabel
    || !configuration.template) {
    throw new Error('Missing configuration');
  }

  const receipts = await fetch(context, configuration);
  const operations = selectOperations(receipts, configuration);
  let updatedCount = 0;
  
  for (const receipt of receipts) {
    context.log('debug', `Traitement du reçu '${receipt.id}' du '${receipt.date.toLocaleString('fr-fr')}'`);
    if (processReceiptMatch(context, configuration, operations, receipt)) {
      ++updatedCount;
    }
  }

  context.log('info', `${updatedCount} opérations mises à jour`);

  const movedCount = business.executeRules();
  context.log('info', `Exécution des règles : ${movedCount} opérations classées`);
}

function processReceiptMatch(context: BotExecutionContext, configuration: Configuration, operations: Operation[], receipt: Receipt) {
  const matches = operations.filter(op => (op.amount === -receipt.amount && diffDays(op.date, receipt.date) <= configuration.matchDaysDiff) && (op.label || '').includes(configuration.matchLabel));
  
  // Sort by closest date
  matches.sort((op1, op2) => diffDays(op1.date, receipt.date) - diffDays(op2.date, receipt.date));

  const operation = matches[0];
  if (!operation) {
    context.log('debug', 'Pas de correspondance trouvée');
    return false;
  }
  
  const newNote = formatNote(configuration, receipt);
  
  if ((operation.note || '').includes(newNote)) {
    context.log('debug', 'Correspondance trouvée, mais notes déjà présente. Rien à faire.');
    return false;
    
  }
  
  context.log('info', 'Correspondance trouvée, ajout des notes');
  business.operationAppendNote(newNote, operation._id);

  return true;
}

function diffDays(date1: Date, date2: Date) {
  const diff = Math.abs(date1.valueOf() - date2.valueOf());
  return diff / (1000 * 60 * 60 * 24);
}

function formatNote(configuration: Configuration, receipt: Receipt) {
  return configuration.template.replace('{metadata}', formatMetadata(receipt));
}

function formatMetadata(receipt: Receipt) {
  return [
    `[${receipt.id}](${receipt.url})`,
    ...receipt.transaction.map(it => `- ${it.name} : ${it.value.join(' - ')}`),
    '',
    '| Description | P.U. | Qté | Montant |',
    '| - | - | - | - |',
    ...receipt.items.map(it => `| ${it.description.join(' - ')} | ${formatAmount(it.unitPrice)} | ${it.quantity} | ${formatAmount(it.amount)}`),
    '',
    'Totaux',
    '',
    ...receipt.totals.map(it => `- ${it.name} : ${formatAmount(it.amount)}`),
    '',
    'Sources',
    '',
    ...receipt.sources.map(it => `- ${it.name} : ${formatAmount(it.amount)}`),
  ].join('\n');
}

function formatAmount(amount: Amount) {
  return amount.value.toFixed(2) + ' ' + amount.currency;
}