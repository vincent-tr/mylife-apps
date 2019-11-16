'use strict';

const path                   = require('path');
const config                 = require('../config');
const { images, thumbnails, unwrapBinary } = require('../repository');

module.exports = ({ express, asyncHandler }) => {
  const router = express.Router();

  router.route('/raw/:iid').get(asyncHandler(async (req, res) => {
    const { iid } = req.params;
    const { ipath, mime } = await images.getByIId(iid);
    res.contentType(mime);
    res.sendFile(path.join(config.gallery, ipath));
  }));

  router.route('/thumbnail/:iid').get(asyncHandler(async (req, res) => {
    const { iid } = req.params;
    const { content } = await thumbnails.getByIId(iid);
    res.contentType('image/png');
    res.send(unwrapBinary(content));
  }));

  return router;
};
