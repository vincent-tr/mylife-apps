'use strict';

import React from 'react';
import Layout from './layout';
import { components } from '../../src';
import icon from '../icon.ico';

const App = () => (
  <Layout
    viewName={'Components'}
    viewIcon={icon}>
    <div>
      <components.Button primary>primary</components.Button>
      <components.Button>secondary</components.Button>
      <components.Button disabled primary>disabled primary</components.Button>
      <components.Button disabled>disabled secondary</components.Button>
    </div>
  </Layout>
);

export default App;