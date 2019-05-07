'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';

const columns = [
  { id: 'col1', text: 'Column1' },
  { id: 'col2', text: 'Column2' },
  { id: 'col3', text: 'Column3' },
];

const data = [
  { col1: 'Cell11', col2: 'Cell12', col3: 'Cell13' },
  { col1: 'Cell21', col2: 'Cell22', col3: 'Cell23' },
  { col1: 'Cell31', col2: 'Cell32', col3: 'Cell33' },
  { col1: 'Cell41', col2: 'Cell42', col3: 'Cell43' },
];

const Tables = () => (
  <components.Table columns={columns} data={data} />
);

Tables.meta = {
  menu: 'Components',
  icon: null,
  title: 'Tables'
};

export default Tables;
