'use strict';

const { processImage } = require('./image');
const { processVideo } = require('./video');

exports.processFile = (type, content, documentValues) => {
  switch(type) {
    case 'image':
      processImage(content, documentValues);
      break;

    case 'video':
      processVideo(content, documentValues);
      break;
  }

};
