'use strict';

import thunk            from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promise          from './promise';
import routing          from '../../modules/routing/middleware';

export default [routing, promise, thunk, createLogger()];
