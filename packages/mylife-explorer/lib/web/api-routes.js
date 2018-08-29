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
    const path = req.params[0];
    throw new Error('TODO');
  }));

  return router;
};
