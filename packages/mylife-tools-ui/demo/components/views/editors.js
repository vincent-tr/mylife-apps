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
  const [ stringValue2, setStringValue2 ] = useState('string value');
  const [ stringValue3, setStringValue3 ] = useState('short val');
  const [ integerValue, setIntegerValue ] = useState(42);
  const [ integerValue2, setIntegerValue2 ] = useState(42);
  const [ integerValue3, setIntegerValue3 ] = useState(5);
  const [ integerValue4, setIntegerValue4 ] = useState(5);
  const [ integerValue5, setIntegerValue5 ] = useState(5);
  const [ integerValue6, setIntegerValue6 ] = useState(5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <h3 style={styles.title}>String</h3>
      <div><span style={styles.label}>Basic</span><components.Editor type='string' value={stringValue} onChange={setStringValue} /></div>
      <div><span style={styles.label}>Nullable</span><components.Editor type='string' nullable={true} value={stringValue2} onChange={setStringValue2} /></div>
      <div><span style={styles.label}>Max length</span><components.Editor type='string' value={stringValue3} onChange={setStringValue3} maxLength={10} /></div>
      <div><span style={styles.label}>Disabled</span><components.Editor type='string' enabled={false} value='string disabled' onChange={() => {}} /></div>
      <div><span style={styles.label}>Readonly</span><components.Editor type='string' readOnly={true} value='string readonly' onChange={() => {}} /></div>

      <h3 style={styles.title}>Integer</h3>
      <div><span style={styles.label}>Basic</span><components.Editor type='integer' value={integerValue} onChange={setIntegerValue} /></div>
      <div><span style={styles.label}>Nullable</span><components.Editor type='integer' nullable={true} value={integerValue2} onChange={setIntegerValue2} /></div>
      <div><span style={styles.label}>Min/Max</span><components.Editor type='integer' value={integerValue3} onChange={setIntegerValue3} min={1} max={10} /></div>
      <div><span style={styles.label}>Nullable Min/Max</span><components.Editor type='integer' nullable={true} value={integerValue4} onChange={setIntegerValue4} min={1} max={10} /></div>
      <div><span style={styles.label}>Disabled</span><components.Editor type='integer' enabled={false} value={42} onChange={() => {}} /></div>
      <div><span style={styles.label}>Readonly</span><components.Editor type='integer' readOnly={true} value={42} onChange={() => {}} /></div>
      <div><span style={styles.label}>Slider</span><components.Editor type='integer' display='slider' value={integerValue5} onChange={setIntegerValue5} min={0} max={10} /></div>
      <div><span style={styles.label}>Slider Nullable</span><components.Editor type='integer' display='slider' nullable={true} value={integerValue6} onChange={setIntegerValue6} min={0} max={10} /></div>
      <div><span style={styles.label}>Slider Disabled</span><components.Editor type='integer' display='slider' enabled={false} value={5} min={0} max={10} onChange={() => {}} /></div>
      <div><span style={styles.label}>Slider Readonly</span><components.Editor type='integer' display='slider' readOnly={true} value={5} min={0} max={10} onChange={() => {}} /></div>
    </div>
  );
};

Editors.meta = {
  menu: 'Components',
  icon: null,
  title: 'Editors'
};

export default Editors;
