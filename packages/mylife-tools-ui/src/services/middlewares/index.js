'use strict';

import thunk            from './thunk';
import { createLogger } from 'redux-logger';
import download         from '../../modules/download/middleware';
import io               from '../../modules/io/middleware';
import routing          from '../../modules/routing/middleware';

const middlewares = [download, routing, io, thunk];

if(process.env.NODE_ENV !== 'production') {
  middlewares.push(createLogger());
}

export default middlewares;
