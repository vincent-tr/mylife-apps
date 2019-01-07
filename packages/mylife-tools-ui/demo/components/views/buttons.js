'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

const Buttons = () => (
  <div>
    <components.Button primary>primary</components.Button>
    <components.Button>secondary</components.Button>
    <components.Button disabled primary>disabled primary</components.Button>
    <components.Button disabled>disabled secondary</components.Button>
  </div>
);

Buttons.meta = {
  icon: null,
  title: 'Buttons'
};

export default Buttons;
