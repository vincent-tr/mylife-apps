'use strict';

import React, { useState } from 'react';
import { components } from 'mylife-tools-ui';

const Containers = () => {
  const [ current, setCurrent ] = useState('tab1');
  return (
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
        <components.TabPanel stretch current={current} onChange={setCurrent}>
          <components.Tab id='tab1' header='Tab1'>
            Content1
          </components.Tab>
          <components.Tab id='tab2' header='Tab2'>
            Content2
          </components.Tab>
          <components.Tab id='tab3' header='Tab3'>
            Content3
          </components.Tab>
        </components.TabPanel>
      </components.Splitter>
    </components.GroupBox>
  );
};

Containers.meta = {
  icon: null,
  title: 'Containers'
};

export default Containers;
