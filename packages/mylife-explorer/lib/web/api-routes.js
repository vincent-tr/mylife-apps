'use strict';

const express = require('express');
const asyncHandler = require('express-async-handler');
const { create : fsCreate } = require('../fs');

module.exports = (options) => {
  const router = express.Router();
  const fs = fsCreate(options);

  router.get(/\/metadata\/(.*)/, asyncHandler(async (req, res) => {
    const path = req.params[0];
    const data = await fs.metadata(path);
    res.json(data);
  }));

  router.get(/\/content\/(.*)/, asyncHandler(async (req, res) => {
    const path           = req.params[0];
    const { size, mime } = await fs.getInfos(path);
    const { range }      = req.headers;

    if(range) {
      const parts     = range.replace(/bytes=/, '').split('-');
      const start     = parseInt(parts[0], 10);
      const end       = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = (end - start) + 1;
      const stream    = fs.createReadStream(path, { start, end });
      const head = {
        'Content-Range'  : `bytes ${start}-${end}/${size}`,
        'Accept-Ranges'  : 'bytes',
        'Content-Length' : chunksize,
        'Content-Type'   : mime,
      };
      res.writeHead(206, head);
      stream.pipe(res);
    } else {
      const stream = fs.createReadStream(path);
      const head = {
        'Content-Length' : size,
        'Content-Type'   : mime,
      };
      res.writeHead(200, head);
      stream.pipe(res);
    }
  }));

  return router;
};
