'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

const Containers = () => (
  <components.GroupBox title='Titre'>
    <components.Splitter>
      <components.Container stretch borders scroll>
        Pane1
      </components.Container>
      <components.Container stretch>
        Pane2
      </components.Container>
    </components.Splitter>
  </components.GroupBox>
);

// TODO: Container, TabPanel

Containers.meta = {
  icon: null,
  title: 'Containers'
};

export default Containers;
