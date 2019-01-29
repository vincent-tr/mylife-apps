'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

const Containers = () => (
  <components.GroupBox stretch title='Titre'>
    <components.Splitter>
      <div>Pane1</div>
      <div>Pane2</div>
    </components.Splitter>
  </components.GroupBox>
);

// TODO: ScrollArea

Containers.meta = {
  icon: null,
  title: 'Containers'
};

export default Containers;
