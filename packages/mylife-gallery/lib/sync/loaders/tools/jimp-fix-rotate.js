'use strict';

const jimp = require('jimp');

fixJimpRotate();

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
