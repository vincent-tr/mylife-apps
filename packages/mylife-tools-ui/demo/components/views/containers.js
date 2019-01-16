'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

const Containers = () => (
  <div>
    <components.GroupBox title='Titre'>
      <div style={{ position: 'relative', height: '10em'}}>
        <components.Splitter>
          <div>Pane1</div>
          <div>Pane2</div>
        </components.Splitter>
      </div>
    </components.GroupBox>
    TODO
    ScrollArea
  </div>
);

Containers.meta = {
  icon: null,
  title: 'Containers'
};

export default Containers;
