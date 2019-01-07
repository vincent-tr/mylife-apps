'use strict';

import React from 'react';
import Layout from './layout';
import Dispatcher from './dispatcher';
import { components } from 'mylife-tools-ui';

const App = () => (
  <components.Application>
    <Layout>
      <Dispatcher />
    </Layout>
  </components.Application>
);

export default App;
