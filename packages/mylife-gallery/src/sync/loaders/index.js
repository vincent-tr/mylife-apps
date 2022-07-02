'use strict';

const { processImage } = require('./image');
const { processVideo } = require('./video');

exports.processFileWithLoader = async (type, content, documentPath) => {
  switch(type) {
    case 'image':
      return await processImage(content, documentPath);

    case 'video':
      return await processVideo(content, documentPath);
  }

};
