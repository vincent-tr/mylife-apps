'use strict';

import React, { useState } from 'react';
import { components } from 'mylife-tools-ui';

const styles = {
  label: {
    marginLeft: '2rem',
    width: '10rem',
    display: 'inline-block'
  },
  title: {
    marginLeft: '0.5rem',
  }
};

const Editors = () => {
  const [ stringValue, setStringValue ] = useState('string value');
  const [ integerValue, setIntegerValue ] = useState(42);
  const [ integerValue2, setIntegerValue2 ] = useState(42);
  const [ integerValue3, setIntegerValue3 ] = useState(5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <h3 style={styles.title}>String</h3>
      <div><span style={styles.label}>Basic</span><components.Editor type='string' value={stringValue} onChange={setStringValue} /></div>
      <div><span style={styles.label}>Disabled</span><components.Editor type='string' enabled={false} value='string disabled' onChange={() => {}} /></div>
      <div><span style={styles.label}>Readonly</span><components.Editor type='string' readOnly={true} value='string readonly' onChange={() => {}} /></div>

      <h3 style={styles.title}>Integer</h3>
      <div><span style={styles.label}>Not nullable</span><components.Editor type='integer' value={integerValue} onChange={setIntegerValue} /></div>
      <div><span style={styles.label}>Nullable</span><components.Editor type='integer' nullable={true} value={integerValue2} onChange={setIntegerValue2} /></div>
      <div><span style={styles.label}>Min/Max</span><components.Editor type='integer' value={integerValue3} onChange={setIntegerValue3} min={1} max={10} /></div>
    </div>
  );
};

Editors.meta = {
  menu: 'Components',
  icon: null,
  title: 'Editors'
};

export default Editors;
