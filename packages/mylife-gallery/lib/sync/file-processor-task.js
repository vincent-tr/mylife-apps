'use strict';

const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { createLogger } = require('mylife-tools-server');
const { DocumentCleanupTask } = require('./document-cleanup-task');
const business = require('../business');

const logger = createLogger('mylife:gallery:sync:file-processor-task');

// https://blog.filestack.com/thoughts-and-knowledge/complete-image-file-extension-list/
const IMAGE_EXTENSIONS = [
  '.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', // JPEG
  '.png', // PNG
  '.gif', // GID
  '.webp', // WEBP
  '.tiff', '.tif', // TIFF
  '.bmp', '.dib', // BMP
  '.jp2', '.j2k', '.jpf', '.jpx', '.jpm', '.mj2', // JPEG 2000
  '.svg', '.svgz', // SVG
];

// https://blog.filestack.com/thoughts-and-knowledge/complete-list-audio-video-file-formats/
const VIDEO_EXTENSIONS = [
  '.webm',
  '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv',
  '.mp4', '.m4p', '.m4v',
  '.avi',
  '.wmv',
  '.mov', '.qt',
  '.flv', '.swf',
];

exports.FileProcessorTask = class FileProcessorTask {
  constructor(list) {
    this.list = list;
  }

  async runStep() {
    const item = this.list.shift();

    try {
      await this.processFile(item);
    } catch(err) {
      logger.error(`Error processing file '${item.fullPath}': ${err.stack}`);
    }

    return !!this.list.length;
  }

  createNextTask() {
    return new DocumentCleanupTask();
  }

  async processFile({ fullPath, relativePath, updateDate, size }) {

    logger.info(`Processing file '${relativePath}'`);
    const content = await fs.readFile(fullPath);
    const hash = createHash(content);

    const existingDocument = business.documentFindByHash(hash);
    if(existingDocument) {
      // only add the other path
      logger.info(`Added path '${relativePath}' to document '${existingDocument._entity}:${existingDocument._id}'`);
      business.documentAddPath(existingDocument, relativePath);
      return;
    }

    // new document
    const type = getDocumentType(relativePath);

    const documentValues = {
      hash,
      paths: [{ path, updateDate }],
      integrationDate: new Date(),
      fileSize: size
    };

    switch(type) {
      case 'image':
        processImage(content, documentValues);
        break;

      case 'video':
        processVideo(content, documentValues);
        break;
    }

    const newDocument = business.documentCreate(type, documentValues);
    logger.info(`Create document '${newDocument._entity}:${newDocument._id}' from path '${relativePath}'`);
  }
};

function processImage(content, documentValues) {
  // TODO
}

function processVideo(content, documentValues) {
  // TODO
}

function createHash(content) {
  const hasher = crypto.createHash('sha1');
  hasher.update(content);
  return hasher.digest('hex');
}

const EXTENSION_TO_TYPE = createExtensionToType();

function getDocumentType(relativePath) {
  const extension = path.extname(relativePath).toLowerCase();
  return EXTENSION_TO_TYPE[extension] || 'other';
}

function createExtensionToType() {
  const result = {};
  for(const extension of IMAGE_EXTENSIONS) {
    result[extension] = 'image';
  }
  for(const extension of VIDEO_EXTENSIONS) {
    result[extension] = 'video';
  }
  return result;
}
