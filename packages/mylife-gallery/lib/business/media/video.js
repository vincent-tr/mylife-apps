'use strict';

const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const { createLogger } = require('mylife-tools-server');

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

const logger = createLogger('mylife:gallery:business:media:video');


exports.videoGetMetadata = async function(fullPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(fullPath, (err, metadata) => (err ? reject(err) : resolve(metadata)));
  });
};

exports.videoCreateThumbnails = async function(baseDirectory, fullPath, { timestamps, height, width }) {

  // scale to fit 200x200
  const size = width > height ? '200x?' : '?x200';

  let filenames;

  const command = ffmpeg(fullPath);
  command.thumbnails({ folder: baseDirectory, filename: '%b-thumbnail-%i', timestamps, size });
  command.on('filenames', value => (filenames = value));

  await new Promise((resolve, reject) => {
    command.on('end', resolve);
    command.on('error', reject);
  });

  return filenames;
};

exports.videoToWebMStream = function (fullPath, outputStream) {
  const command = ffmpeg(fullPath);
  command.format('webm');

  // https://superuser.com/questions/525928/ffmpeg-keeping-quality-during-conversion
  command.addOptions(['-lossless 1']);

  command.on('error', err => {
    logger.error(err.stack);
  });

  command.pipe(outputStream, { end: true });
};
