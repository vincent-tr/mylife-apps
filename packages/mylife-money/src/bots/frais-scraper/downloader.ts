import { Stream } from 'node:stream';
import { ImapFlow, FetchMessageObject, MessageStructureObject } from 'imapflow';

import { createLogger } from 'mylife-tools-server';
import { BotExecutionContext } from '../api';
import { processSecret } from '../helpers';
import { Configuration, File } from './common';

const imapLogger = createLogger('mylife:money:bots:frais-scraper:imap');

export async function download(context: BotExecutionContext, configuration: Configuration) {
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

      let files: File[] = [];

      for (const message of messages) {
        const newFiles = await processAttachments(context, client, message);
        files = files.concat(newFiles);
      }

      return files;

    } finally {
      lock.release();
    }

  } finally {
    await client.logout();
  }
}

function wrapImapLogger() {
    
  interface ImapLog {
    msg: string;
    err?: Error;
  }

  function formatLog({ msg, err }: ImapLog) {
    return err ? `${msg}: ${err.stack}` : msg;
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

async function processLookup(client: ImapFlow, configuration: Configuration) {

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

async function processAttachments(context: BotExecutionContext, client: ImapFlow, message: FetchMessageObject) {
  const files: File[] = [];

  const attachements = flattenNodes(message.bodyStructure).filter(node => node.disposition === 'attachment' && node.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  if (attachements.length === 0) {
    context.log('warning', `Mail '${message.uid}' (${message.envelope.date.toLocaleString()}, '${message.envelope.subject}' de '${message.envelope.from[0].address}): Pas de pièce jointe excel, ignoré`);
    return;
  }

  for (const attachment of attachements) {
    const downloadObject = await client.download(message.uid.toString(), attachment.part, { uid: true });
    const data = await stream2buffer(downloadObject.content);

    const metadata = {
      mailId: `${message.uid}:${attachment.part}`,
      mailDate: message.envelope.date,
      mailFrom: message.envelope.from[0].address,
      mailSubject: message.envelope.subject,
      filename: (attachment.dispositionParameters as any).filename,
    };

    files.push({ data, metadata });
  }

  return files;
}

function flattenNodes(node: MessageStructureObject) {
  const childNodes = node.childNodes || [];
  let results = childNodes;

  for (const node of childNodes) {
    results = results.concat(flattenNodes(node));
  }

  return results;
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
