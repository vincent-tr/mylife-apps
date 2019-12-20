'use strict';

const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);


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
