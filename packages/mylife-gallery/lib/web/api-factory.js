'use strict';

const createImagesRoutes = require('./images-routes');
const createApiRoutes    = require('./api-routes');

exports.webApiFactory = ({ app, express, asyncHandler, webApiHandler }) => {
  app.use('/images', createImagesRoutes({ express, asyncHandler, webApiHandler }));
  app.use('/api', createApiRoutes({ express, asyncHandler, webApiHandler }));

};
