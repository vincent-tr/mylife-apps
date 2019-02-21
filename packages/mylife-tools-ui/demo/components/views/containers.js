'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

const Containers = () => (
  <components.GroupBox title='Titre'>
    <components.Splitter>
      <div>Pane1</div>
      <div>Pane2</div>
    </components.Splitter>
  </components.GroupBox>
);

// TODO: Container, TabPanel

Containers.meta = {
  icon: null,
  title: 'Containers'
};

export default Containers;
