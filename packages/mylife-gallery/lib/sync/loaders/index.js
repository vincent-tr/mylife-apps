'use strict';

const { processImage } = require('./image');
const { processVideo } = require('./video');

exports.processFileWithLoader = async (type, content, documentValues) => {
  switch(type) {
    case 'image':
      await processImage(content, documentValues);
      break;

    case 'video':
      await processVideo(content, documentValues);
      break;
  }

};
