'use strict';

import React from 'react';
import Layout from './layout';
import { components } from 'mylife-tools-ui';
import icon from '../icon.ico';

const App = () => (
  <components.Application>
    <Layout>
      <div>
        <components.Button primary>primary</components.Button>
        <components.Button>secondary</components.Button>
        <components.Button disabled primary>disabled primary</components.Button>
        <components.Button disabled>disabled secondary</components.Button>
      </div>
    </Layout>
  </components.Application>
);

export default App;
