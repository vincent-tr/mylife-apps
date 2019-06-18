'use strict';

import thunk            from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promise          from './promise';
import routing          from '../../modules/routing/middleware';
import io               from '../../modules/io/middleware';

export default [routing, io, promise, thunk, createLogger()];
