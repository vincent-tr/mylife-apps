'use strict';

const cwebp = require('webp-converter/cwebp');
const child_process = require('child_process');
const { fsScope } = require('./fs-helper');

const converterPath = cwebp();

exports.convertBufferToWebpStream = async function(content) {
  return await fsScope('webp-converter', async (fsh) => {
    const inputFile = await fsh.createInputFileFromBuffer(content);
    const outputFile = fsh.createFileName();
    await convertFileToWebp(inputFile, outputFile);
    return fsh.getStreamFromOutputFile(outputFile);
  });
};

exports.convertBufferToWebpBuffer = async function(content) {
  return await fsScope('webp-converter', async (fsh) => {
    const inputFile = await fsh.createInputFileFromBuffer(content);
    const outputFile = fsh.createFileName();
    await convertFileToWebp(inputFile, outputFile);
    return await fsh.getBufferFromOutputFile(outputFile);
  });
};

exports.convertFileToWebp = convertFileToWebp;
async function convertFileToWebp(inputFile, outputFile) {
  await callWebpConverter('-q', '80', inputFile, '-o', outputFile);
}

async function callWebpConverter(...args) {
  return new Promise((resolve, reject) => {
    child_process.execFile(converterPath, args, (error) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}
