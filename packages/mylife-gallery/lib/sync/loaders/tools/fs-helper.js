'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');

exports.fsScope = async function(prefix, callback) {
  const fsh = new FsHelper();
  await fsh.init(prefix);
  try {
    return await callback(fsh);
  } finally {
    await fsh.terminate();
  }
};

class FsHelper {
  async init(prefix) {
    this.counter = 0;
    this.baseDirectory = await fs.mkdtemp(path.join(os.tmpdir(), prefix + '-'));
  }

  async terminate() {
    await fs.remove(this.baseDirectory);
  }

  createFileName() {
    return path.join(this.baseDirectory, `file-${this.counter++}`);
  }

  async createInputFileFromBuffer(content) {
    const fileName = this.createFileName();
    await fs.writeFile(fileName, content);
    return fileName;
  }

  createInputFileWithStream() {
    const fileName = this.createFileName();
    const stream = fs.createWriteStream(fileName);
    return { fileName,  stream };
  }

  async getBufferFromOutputFile(fileName) {
    return await fs.readFile(fileName);
  }

  async getStreamFromOutputFile(fileName) {
    return await fs.createReadStream(fileName);
  }
}
