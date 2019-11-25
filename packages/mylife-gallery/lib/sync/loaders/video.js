'use strict';

const FfmpegCommand = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

FfmpegCommand.setFfmpegPath(ffmpegStatic.path);

exports.processVideo = async (content, documentValues) => {
  // TODO
};
