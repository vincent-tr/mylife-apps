'use strict';

const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const { createLogger } = require('mylife-tools-server');

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

const logger = createLogger('mylife:gallery:sync:loaders:tools:ffmpeg');

exports.getMetadata = async function(fullPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(fullPath, (err, metadata) => (err ? reject(err) : resolve(metadata)));
  });
};

exports.createThumbnails = async function(baseDirectory, fullPath, { timestamps, height, width }) {

  // scale to fit 200x200
  const size = width > height ? '200x?' : '?x200';

  let filenames;

  const command = ffmpeg(fullPath);
  command.on('filenames', value => (filenames = value));

  const promise = new Promise((resolve, reject) => {
    command.on('end', resolve);
    command.on('error', reject);
  });

  command.thumbnails({ folder: baseDirectory, filename: '%b-thumbnail-%i', timestamps, size });

  await promise;

  return filenames;
};

exports.toWebMStream = function (fullPath, outputStream) {
  const command = ffmpeg(fullPath);
  command.format('webm');

  // https://superuser.com/questions/525928/ffmpeg-keeping-quality-during-conversion
  command.addOptions(['-lossless 1']);

  command.on('error', err => {
    logger.error(err.stack);
  });

  command.pipe(outputStream, { end: true });
};
