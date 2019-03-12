'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

const Buttons = () => (
  <div>
    <components.Button primary>primary</components.Button>
    <components.Button>secondary</components.Button>
    <components.Button enabled={false} primary>disabled primary</components.Button>
    <components.Button enabled={false}>disabled secondary</components.Button>
  </div>
);

Buttons.meta = {
  menu: 'Components',
  icon: null,
  title: 'Buttons'
};

export default Buttons;
