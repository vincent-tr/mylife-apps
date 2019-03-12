'use strict';

import React, { useState } from 'react';
import { components } from 'mylife-tools-ui';

const Editors = () => {
  const [ stringValue, setStringValue ] = useState('string value');
  return (
    <div>
      <components.Editor type='string' value={stringValue} onChange={setStringValue} />
      TODO
    </div>
  );
};

Editors.meta = {
  menu: 'Components',
  icon: null,
  title: 'Editors'
};

export default Editors;
