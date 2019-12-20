'use strict';

const { createLogger } = require('mylife-tools-server');
const ffmpeg = require('fluent-ffmpeg'); // TODO: common lib with static link
const logger = createLogger('mylife:gallery:web:video-utils');

exports.sendVideo = function (fullPath, response) {
  const command = ffmpeg(fullPath);
  command.format('webm');

  command.on('error', err => {
    logger.error(err.stack);
  });

  response.contentType('video/webm');
  command.pipe(response, { end: true });
};
