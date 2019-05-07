'use strict';

import React, { useState } from 'react';
import { components } from 'mylife-tools-ui';

const columns = [
  { id: 'col1', text: 'Column1' },
  { id: 'col2', text: 'Column2' },
  { id: 'col3', text: 'Column3' },
];

const bigData = new Array(1000).fill().map((_, index) => ({
  col1: `Cell-${index}-1`, col2: `Cell-${index}-2`, col3: `Cell-${index}-3`
}));

const smallData = new Array(10).fill().map((_, index) => ({
  col1: `Cell-${index}-1`, col2: `Cell-${index}-2`, col3: `Cell-${index}-3`
}));

const Tables = () => {
  const [big, setBig] = useState(false);

  return (
    <components.Box style={{ display: 'flex', flexDirection: 'column' }}>
      <components.Container stretch={false}>
        <span>Big data</span>
        <components.Editor type='boolean' value={big} onChange={setBig} />
      </components.Container>
      <components.Table columns={columns} data={big ? bigData : smallData} stretch={false} style={{ flex: '1 1 auto', position: 'relative'}} />
    </components.Box>
  );
};

Tables.meta = {
  menu: 'Components',
  icon: null,
  title: 'Tables'
};

export default Tables;
