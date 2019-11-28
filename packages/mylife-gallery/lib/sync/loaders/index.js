'use strict';

const { processImage } = require('./image');
const { processVideo } = require('./video');

exports.processFileWithLoader = async (type, content, documentPath) => {
  switch(type) {
    case 'image':
      await processImage(content, documentPath);
      break;

    case 'video':
      await processVideo(content, documentPath);
      break;
  }

};
