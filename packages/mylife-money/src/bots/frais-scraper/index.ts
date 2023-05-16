import { BotExecutionContext } from '../api';
import { Configuration, Item } from './common';
import { download } from './downloader';
import { JulieParser, VincentParser } from './parser';

const PARSERS = {
  'julie': new JulieParser(),
  'vincent': new VincentParser()
};

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

  console.dir(items, { depth: null });
}
