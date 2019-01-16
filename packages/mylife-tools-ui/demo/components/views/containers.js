'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

import './containers.scss';

const Containers = () => (
  <div>
    <components.GroupBox title='Titre' className='demo-groupbox-content'>
      <components.Splitter customClassName='demo-splitter'>
        <div>Pane1</div>
        <div>Pane2</div>
      </components.Splitter>
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
