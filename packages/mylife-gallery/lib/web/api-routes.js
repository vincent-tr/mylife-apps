'use strict';

const express = require('express');
const asyncHandler = require('express-async-handler');
const { albums, images } = require('../repository');

module.exports = () => {
  const router = express.Router();

  router.route('/albums').get(asyncHandler(async (req, res) => {
    const list = await albums.list();
    res.json(list.map(({ name, first, count }) => ({ name, first, count })));
  }));

  router.route('/album/:name').get(asyncHandler(async (req, res) => {
    const { name } = req.params;
    const album = await albums.getByName(name);
    const imgs = await images.listByAlbum(album._id);
    res.json(imgs.map(({ iid, metadata }) => ({ id : iid, metadata })));
  }));

  return router;
};
