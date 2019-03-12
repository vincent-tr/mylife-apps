'use strict';

import React, { useState } from 'react';
import { components } from 'mylife-tools-ui';

const Editors = () => {
  const [ stringValue, setStringValue ] = useState('string value');
  return (
    <div>
      <components.Editor type='string' value={stringValue} onChange={setStringValue} />
      <components.Editor type='string' enabled={false} value='string disabled' onChange={() => {}} />
      <components.Editor type='string' readOnly={true} value='string readonly' onChange={() => {}} />
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
