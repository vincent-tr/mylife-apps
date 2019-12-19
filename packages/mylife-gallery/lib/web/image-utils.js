'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const jimp = require('jimp');
const cwebp = require('webp-converter/cwebp');
const child_process = require('child_process');

fixJimpRotate();

exports.prepareImage = async function (fullPath) {
  const source = await fs.readFile(fullPath);
  const rotated = await rotateIfNeeded(source);
  const target = await toWebP(rotated);
  return { content: target, mime: 'image/webp' };
};

async function rotateIfNeeded(content) {
  // jpeg rotation if needed
  const image = await jimp.read(content);
  return await image.getBufferAsync(jimp.MIME_PNG);
}

async function toWebP(source) {
  const fsh = new FsHelper();
  await fsh.init();
  try {
    await fsh.input(source);
    const { input, output } = fsh.fileNames();
    await callWebpConverter('-q', '80', input, '-o', output);
    return await fsh.output();
  } finally {
    await fsh.terminate();
  }
}

const converterPath = cwebp();

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

class FsHelper {
  async init() {
    this.counter = 0;
    this.baseDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'webp-'));
  }

  async terminate() {
    await fs.remove(this.baseDirectory);
  }

  async input(content) {
    const fullPath = path.join(this.baseDirectory, 'input');
    await fs.writeFile(fullPath, content);
    return fullPath;
  }

  async output() {
    const fullPath = path.join(this.baseDirectory, 'output');
    return fs.readFile(fullPath);
  }

  fileNames() {
    return {
      input: path.join(this.baseDirectory, 'input'),
      output: path.join(this.baseDirectory, 'output')
    };
  }
}

function fixJimpRotate() {
  // https://github.com/oliver-moran/jimp/issues/721
  jimp.prototype.rotateOrigin = jimp.prototype.rotate;
  jimp.prototype.simpleRotate = simpleRotate;

  jimp.prototype.rotate = function(deg, mode, cb) {
    if(deg % 90 !== 0 || mode || cb) {
      return this.rotateOrigin(deg, mode, cb);
    }

    this.simpleRotate(deg);
  };
}

function simpleRotate(deg) {
  let steps = Math.round(deg / 90) % 4;
  steps += steps < 0 ? 4 : 0;

  if (steps === 0) return;

  const srcBuffer = this.bitmap.data;
  const len = srcBuffer.length;
  const dstBuffer = Buffer.allocUnsafe(len);

  let tmp;

  if (steps === 2) {
    // Upside-down
    for (let srcOffset = 0; srcOffset < len; srcOffset += 4) {
      tmp = srcBuffer.readUInt32BE(srcOffset, true);
      dstBuffer.writeUInt32BE(tmp, len - srcOffset - 4, true);
    }
  } else {
    // Clockwise or counter-clockwise rotation by 90 degree
    rotate90degrees(this.bitmap, dstBuffer, steps === 1);

    tmp = this.bitmap.width;
    this.bitmap.width = this.bitmap.height;
    this.bitmap.height = tmp;
  }

  this.bitmap.data = dstBuffer;
}

function rotate90degrees(bitmap, dstBuffer, clockwise) {
  const dstOffsetStep = clockwise ? -4 : 4;
  let dstOffset = clockwise ? dstBuffer.length - 4 : 0;

  let tmp;
  let x;
  let y;
  let srcOffset;

  for (x = 0; x < bitmap.width; x++) {
    for (y = bitmap.height - 1; y >= 0; y--) {
      srcOffset = (bitmap.width * y + x) << 2;
      tmp = bitmap.data.readUInt32BE(srcOffset, true);
      dstBuffer.writeUInt32BE(tmp, dstOffset, true);
      dstOffset += dstOffsetStep;
    }
  }
}
