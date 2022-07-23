import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { createLogger } from 'mylife-tools-server';

ffmpeg.setFfmpegPath(path.join(__dirname, 'ffmpeg/ffmpeg'));
ffmpeg.setFfprobePath(path.join(__dirname, 'ffmpeg/ffprobe'));

const logger = createLogger('mylife:gallery:sync:loaders:tools:ffmpeg');

export async function getMetadata(fullPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(fullPath, (err, metadata) => (err ? reject(err) : resolve(metadata)));
  });
};

export async function createThumbnails(baseDirectory, fullPath, { timestamps, height, width }) {

  // scale to fit 200x200
  const size = width > height ? '200x?' : '?x200';

  let filenames;

  const command = ffmpeg(fullPath);

  command.on('filenames', value => (filenames = value));

  const promise = new Promise((resolve, reject) => {
    command.on('end', resolve);
    command.on('error', reject);
  });

  command.thumbnails({ folder: baseDirectory, filename: '%b-thumbnail-%i.webp', timestamps, size });

  await promise;

  return filenames;
};

export async function toWebMStream(fullPath, outputStream) {
  // https://video.stackexchange.com/questions/19590/convert-mp4-to-webm-without-quality-loss-with-ffmpeg
  // ffmpeg  -i input.mp4  -b:v 0  -crf 30  -pass 1  -an -f webm /dev/null
  // ffmpeg  -i input.mp4  -b:v 0  -crf 30  -pass 2  output.webm

  // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/217
  await webmPass1(fullPath);

  const command = webmCreateCommand(fullPath);
  command.addOptions(['-pass', '2']);
  command.format('webm');

  command.on('error', err => {
    logger.error(err.stack);
  });

  command.pipe(outputStream, { end: true });

/*
  const command = ffmpeg(fullPath);
  command.format('webm');

  // https://superuser.com/questions/525928/ffmpeg-keeping-quality-during-conversion
  command.addOptions(['-lossless 1']);
  command.on('error', err => {
    logger.error(err.stack);
  });

  command.pipe(outputStream, { end: true });
  */
};

function webmCreateCommand(fullPath) {
  const command = ffmpeg(fullPath);
  command.videoBitrate(0);
  command.addOptions(['-crf', '30']);
  return command;
}

async function webmPass1(fullPath) {
  const command = webmCreateCommand(fullPath);
  command.addOptions(['-pass', '1']);
  command.addOptions(['-an']);
  command.format('webm');
  command.output('/dev/null');

  const promise = new Promise((resolve, reject) => {
    command.on('end', resolve);
    command.on('error', reject);
  });

  command.run();

  await promise;
}

export function toWebPStream(fullPath: string, outputStream) {
  const command = ffmpeg(fullPath);

  command.addOptions(['-lossless 1']);

  command.format('webp');

  command.pipe(outputStream, { end: true });
};


export async function toWebPFile(inPath: string, outPath: string) {
  const command = ffmpeg(inPath);

  command.addOptions(['-lossless 1']);

  command.format('webp');
  command.output(outPath);
  
  const promise = new Promise((resolve, reject) => {
    command.on('end', resolve);
    command.on('error', reject);
  });

  command.run();

  await promise;
};

