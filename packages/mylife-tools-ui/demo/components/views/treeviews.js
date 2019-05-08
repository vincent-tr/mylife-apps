'use strict';

import React, { useState } from 'react';
import { components } from 'mylife-tools-ui';

const data = generateData();

const Treeviews = () => {
  const [value, onSelect] = useState(null);
  return (
    <components.TreeView items={data} value={value} onSelect={onSelect} />
  );
};

Treeviews.meta = {
  menu: 'Components',
  icon: null,
  title: 'Treeviews'
};

export default Treeviews;

function generateData(levels = []) {
  if(levels.length > 3) {
    return [];
  }

  return [1, 2, 3].map(current => {
    const newLevels = [...levels, current];
    const suffix = newLevels.map(level => level.toString()).join('');
    return {
      id: 'item' + suffix,
      text: 'Item' + suffix,
      items: generateData(newLevels)
    };
  });
}
