import thunk from './thunk';
import { createLogger } from 'redux-logger';
import { middleware as download } from '../../modules/download/store';
import { middleware as io } from '../../modules/io/store';
import routing from '../../modules/routing/middleware';

const middlewares = [download, routing, io, thunk];

if (!import.meta.env.PROD) {
  middlewares.push(createLogger({ duration: true, collapsed: () => true }));
}

export default middlewares;
