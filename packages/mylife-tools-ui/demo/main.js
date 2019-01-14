'use strict';

import React from 'react';
import App from './components/app';
import { services } from 'mylife-tools-ui';
import * as reducers from './reducers';

services.initStore(reducers);
services.render(<App/>);
