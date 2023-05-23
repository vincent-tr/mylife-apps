import { BotExecutionContext } from '../api';
import { Configuration, File } from './common';
import { ImapFlow, FetchMessageObject, downloadBodyPart, flattenNodes, mailProcess } from '../mail-scraper-helper';

export async function download(context: BotExecutionContext, configuration: Configuration) {
  return await mailProcess(context, configuration, async(client, messages) => {
    let files: File[] = [];

    for (const message of messages) {
      const newFiles = await processAttachments(context, client, message);
      files = files.concat(newFiles);
    }

    return files;
  });
}

async function processAttachments(context: BotExecutionContext, client: ImapFlow, message: FetchMessageObject) {
  const files: File[] = [];

  const attachements = flattenNodes(message.bodyStructure).filter(node => node.disposition === 'attachment' && node.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  if (attachements.length === 0) {
    context.log('warning', `Mail '${message.uid}' (${message.envelope.date.toLocaleString()}, '${message.envelope.subject}' de '${message.envelope.from[0].address}): Pas de pièce jointe excel, ignoré`);
    return;
  }

  for (const attachment of attachements) {
    const { data } = await downloadBodyPart(client, message, attachment);

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
