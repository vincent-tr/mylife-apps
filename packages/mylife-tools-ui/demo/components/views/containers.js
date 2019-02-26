'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

const Containers = () => (
  <components.GroupBox title='Titre'>
    <components.Splitter>
      <components.Container stretch borders scroll>
        <components.Responsive large laptop>
          <div>desktop</div>
        </components.Responsive>
        <components.Responsive large>
          <div>large</div>
        </components.Responsive>
        <components.Responsive laptop>
          <div>laptop</div>
        </components.Responsive>
        <components.Responsive tablet>
          <div>tablet</div>
        </components.Responsive>
        <components.Responsive mobile>
          <div>mobile</div>
        </components.Responsive>
        <components.Responsive portrait>
          <div>portrait</div>
        </components.Responsive>
        <components.Responsive landscape>
          <div>landscape</div>
        </components.Responsive>
        <components.Responsive landscape tablet mobile>
          <div>tablet or mobile landscape</div>
        </components.Responsive>
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
