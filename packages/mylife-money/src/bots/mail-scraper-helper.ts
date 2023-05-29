import { Stream } from 'node:stream';
import { ImapFlow, FetchMessageObject, MessageStructureObject } from 'imapflow';

import { createLogger } from 'mylife-tools-server';
import { BotExecutionContext } from './api';
import { processSecret } from './helpers';

export { ImapFlow, FetchMessageObject, MessageStructureObject };

export interface ImapConfiguration {
  imapServer: string;
  imapUser: string;
  imapPass: string;
  mailbox: string;
  subject?: string;
  from?: string;
  sinceDays: number;
}

const imapLogger = createLogger('mylife:money:bots:mail-scraper:imap');

function wrapImapLogger() {
    
  interface ImapLog {
    msg: string;
    err?: Error;
  }

  return {
    debug(obj: ImapLog) {
      imapLogger.debug(this.format(obj));
    },
    info(obj: ImapLog) {
      imapLogger.info(this.format(obj));
    },
    warn(obj: ImapLog) {
      imapLogger.warn(this.format(obj));
    },
    error(obj: ImapLog) {
      imapLogger.error(this.format(obj));
    },
    format({ msg, err }: ImapLog) {
      return err ? `${msg}: ${err.stack}` : msg;
    }
  };
}

export async function mailProcess<T>(context: BotExecutionContext, configuration: ImapConfiguration, callback: (client: ImapFlow, messages: FetchMessageObject[]) => Promise<T>) {
  const client = new ImapFlow({
    host: configuration.imapServer,
    port: 993,
    secure: true,
    auth: {
      user: processSecret(context, configuration.imapUser),
      pass: processSecret(context, configuration.imapPass)
    },
    logger: wrapImapLogger()
  });

  await client.connect();
  try {

    const lock = await client.getMailboxLock(configuration.mailbox, { readonly: true });

    try {

      const messages = await processLookup(client, configuration);

      context.log('info', `${messages.length} mails trouvés`);

      return await callback(client, messages);

    } finally {
      lock.release();
    }

  } finally {
    await client.logout();
  }
}

async function processLookup(client: ImapFlow, configuration: ImapConfiguration) {

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - configuration.sinceDays);

  const list = await client.fetch({
    from: configuration.from,
    subject: configuration.subject,
    since: startDate,
  }, {
    uid: true,
    envelope: true,
    bodyStructure: true,
  });

  const fetchedList: FetchMessageObject[] = [];

  // We cannot do other queries (eg: download messages) until we fetch all list
  for await (const message of list) {
    fetchedList.push(message);
  }

  return fetchedList;
}

export function flattenNodes(node: MessageStructureObject, nodes: MessageStructureObject[] = []) {
  nodes.push(node);

  for (const child of node.childNodes || []) {
    flattenNodes(child, nodes);
  }

  return nodes;
}


export async function downloadBodyPart(client: ImapFlow, message: FetchMessageObject, part: MessageStructureObject) {
  const { meta, content } = await client.download(message.uid.toString(), part.part, { uid: true });
  const data = await stream2buffer(content);

  return { meta, data };
}

// https://stackoverflow.com/questions/14269233/node-js-how-to-read-a-stream-into-a-buffer
async function stream2buffer(stream: Stream): Promise<Buffer> {

  return new Promise<Buffer>((resolve, reject) => {

    const buf: Uint8Array[] = [];

    stream.on('data', chunk => buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(buf)));
    stream.on('error', err => reject(new Error(`error converting stream - ${err}`)));
  });
}
