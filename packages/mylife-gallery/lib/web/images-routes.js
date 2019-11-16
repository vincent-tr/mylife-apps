'use strict';

const path = require('path');
const { getConfig } = require('mylife-tools-server');

const { images, thumbnails, unwrapBinary } = require('../repository');

module.exports = ({ express, asyncHandler }) => {
  const router = express.Router();

  router.route('/raw/:iid').get(asyncHandler(async (req, res) => {
    const { iid } = req.params;
    const { ipath, mime } = await images.getByIId(iid);
    res.contentType(mime);
    res.sendFile(path.join(getConfig('gallery'), ipath));
  }));

  router.route('/thumbnail/:iid').get(asyncHandler(async (req, res) => {
    const { iid } = req.params;
    const { content } = await thumbnails.getByIId(iid);
    res.contentType('image/png');
    res.send(unwrapBinary(content));
  }));

  return router;
};
