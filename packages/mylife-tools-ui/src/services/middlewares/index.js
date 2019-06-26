'use strict';

import thunk            from './thunk';
import { createLogger } from 'redux-logger';
import routing          from '../../modules/routing/middleware';
import io               from '../../modules/io/middleware';

export default [routing, io, thunk, createLogger()];
