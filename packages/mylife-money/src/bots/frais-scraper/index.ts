import { BotExecutionContext } from '../api';
import { Configuration, Item } from './common';
import { download } from './downloader';
import { JulieParser, VincentParser } from './parser';
import * as business from '../../business';

const PARSERS = {
  'julie': new JulieParser(),
  'vincent': new VincentParser()
};

type FIXME_any = any;
type Operation = FIXME_any;

export default async function (context: BotExecutionContext) {
  const configuration = context.configuration as Configuration;

  if (!configuration.imapServer || !configuration.imapUser || !configuration.imapPass
    || !configuration.mailbox || !configuration.subject || !configuration.from
    || !configuration.sinceDays || !configuration.parser || !configuration.account
    || !configuration.matchDaysDiff || !configuration.template) {
    throw new Error('Missing configuration');
  }

  const parser = PARSERS[configuration.parser];
  if (!parser) {
    throw new Error(`Parser not found: '${configuration.parser}'`);
  }

  const files = await download(context, configuration);
  let items: Item[] = [];

  for (const file of files) {
    items = items.concat(parser.parse(context, configuration, file));
  }

  context.log('info', `${items.length} lignes trouvées`);

  // Compute min/max date and select operations to lookup
  let min = Infinity;
  let max = -Infinity;

  for (const item of items) {
    min = Math.min(min, item.date.valueOf());
    max = Math.max(max, item.date.valueOf());
  }

  const operations = business.operationsGetUnsorted(new Date(min), new Date(max));

  for (const item of items) {
    context.log('debug', `Traitement de la ligne ${item.metadata.rowIndex} de la sheet '${item.metadata.sheetName}' du fichier '${item.metadata.filename}' du mail intitulé '${item.metadata.mailSubject}' de '${item.metadata.mailFrom}' envoyé le '${item.metadata.mailDate.toLocaleString()}'`);
    processItemMatch(context, configuration, operations, item);
  }
}

function processItemMatch(context: BotExecutionContext, configuration: Configuration, operations: Operation[], item: Item) {
  const matches = operations.filter(op => (op.amount === -item.amount && diffDays(op.date, item.date) <= configuration.matchDaysDiff));

  // Sort by closest date
  matches.sort((op1, op2) => diffDays(op1.date, item.date) - diffDays(op2.date, item.date));

  // TODO: use keywords?

  const operation = matches[0];
  if (!operation) {
    context.log('debug', 'Pas de correspondance trouvée')
    return;
  }

  const newNote = formatNote(configuration, item);
  
  if ((operation.note || '').includes(newNote)) {
    context.log('debug', 'Correspondance trouvée, mais notes déjà présente. Rien à faire.');
    return;
    
  }
  
  context.log('info', 'Correspondance trouvée, ajout des notes');
  business.operationAppendNote(newNote, operation._id);
}

function diffDays(date1: Date, date2: Date) {
  const diff = Math.abs(date1.valueOf() - date2.valueOf());
  return diff / (1000 * 60 * 60 * 24);
}

function formatNote(configuration: Configuration, item: Item) {
  return configuration.template.replace('{metadata}', formatMetadata(item));
}

function formatMetadata(item: Item) {
  const lines: string[] = [];

  for (let [key, value] of Object.entries(item.metadata)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (value instanceof Date) {
      value = value.toLocaleString();
    }

    lines.push(`- ${key} : ${value.toString()}\n`);
  }

  return lines.join('');
}
