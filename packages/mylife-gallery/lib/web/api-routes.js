'use strict';

const { albums, images } = require('../repository');

// TODO: use webApiHandler
module.exports = ({ express, asyncHandler, webApiHandler }) => {
  const router = express.Router();

  router.route('/albums').get(asyncHandler(async (req, res) => {
    const list = await albums.list();
    res.json(list.map(({ name, first, count }) => ({ name, first, count })));
  }));

  router.route('/album/:name').get(asyncHandler(async (req, res) => {
    const { name } = req.params;
    const album = await albums.getByName(name);
    const imgs = await images.listByAlbum(album._id);
    res.json(imgs.map(({ name, iid, metadata }) => ({ name, id : iid, album : album.name, ... metadata })));
  }));

  return router;
};
