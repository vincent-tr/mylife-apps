'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { components } from 'mylife-tools-ui';
import icon from '../../icon.ico';

const styles = {
  label: {
    marginLeft: '2rem',
    width: '10rem',
    display: 'inline-block'
  },
  title: {
    marginLeft: '0.5rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center'
  }
};

const Row = ({ title, initialValue, ...editorProps }) => {
  const [ value, onChange ] = useState(initialValue);
  return (
    <div style={styles.row}>
      <span style={styles.label}>{title}</span>
      <components.Editor value={value} onChange={onChange} {...editorProps} />
    </div>
  );
};

Row.propTypes = {
  title: PropTypes.string.isRequired,
  initialValue: PropTypes.any
};

const Title = ({ children }) => (
  <h3 style={styles.title}>{children}</h3>
);

Title.propTypes = {
  children: PropTypes.string.isRequired
};

const listValues = [
  { value: 'a', text: 'A', icon },
  { value: 'b', text: 'B'},
  { value: 'c', text: 'C'}
];

const Editors = () => (
  <components.Container scroll>

    <Title>String</Title>
    <Row title='Basic' initialValue='string value' type='string' />
    <Row title='Error' initialValue='string value' type='string' error={true} />
    <Row title='Nullable' initialValue='string value' type='string' nullable={true} />
    <Row title='Max length' initialValue='short val' type='string' maxLength={10} />
    <Row title='Disabled' initialValue='string disabled' type='string' enabled={false} />
    <Row title='Readonly' initialValue='string readonly' type='string' readOnly={true} />

    <Title>Integer</Title>
    <Row title='Basic' initialValue={42} type='integer' />
    <Row title='Error' initialValue={42} type='integer' error={true} />
    <Row title='Nullable' initialValue={42} type='integer' nullable={true} />
    <Row title='Min/Max' initialValue={5} type='integer' min={1} max={10} />
    <Row title='Nullable Min/Max' initialValue={5} type='integer' nullable={true} min={1} max={10} />
    <Row title='Disabled' initialValue={42} type='integer' enabled={false}  />
    <Row title='Readonly' initialValue={42} type='integer' readOnly={true}  />
    <Row title='Slider' initialValue={5} type='integer' display='slider' min={0} max={10} />
    <Row title='Slider Error' initialValue={5} type='integer' display='slider' min={0} max={5} error={true} />
    <Row title='Slider big range' initialValue={50} type='integer' display='slider' min={0} max={100} />
    <Row title='Slider Nullable' initialValue={5} type='integer' display='slider' nullable={true} min={0} max={10} />
    <Row title='Slider Disabled' initialValue={5} type='integer' display='slider' enabled={false} min={0} max={10} />
    <Row title='Slider Readonly' initialValue={5} type='integer' display='slider' readOnly={true} min={0} max={10} />

    <Title>Boolean</Title>
    <Row title='Basic' initialValue={false} type='boolean' />
    <Row title='Error' initialValue={false} type='boolean' error={true} />
    <Row title='Nullable' initialValue={false} type='boolean' nullable={true} />
    <Row title='Disabled' initialValue={false} type='boolean' enabled={false} />
    <Row title='Disabled true' initialValue={true} type='boolean' enabled={false} />
    <Row title='Disabled null' initialValue={null} type='boolean' enabled={false} nullable={true} />
    <Row title='Readonly' initialValue={false} type='boolean' readOnly={true} />
    <Row title='Slider' initialValue={false} type='boolean' display='slider' />
    <Row title='Slider Error' initialValue={false} type='boolean' display='slider' error={true} />
    <Row title='Slider Nullable' initialValue={false} type='boolean' display='slider' nullable={true} />
    <Row title='Slider Disabled' initialValue={false} type='boolean' display='slider' enabled={false} />
    <Row title='Slider Disabled true' initialValue={true} type='boolean' display='slider' enabled={false} />
    <Row title='Slider Disabled null' initialValue={null} type='boolean' display='slider' enabled={false} nullable={true} />
    <Row title='Slider Readonly' initialValue={false} type='boolean' display='slider' readOnly={true}  />

    <Title>List</Title>
    <Row title='Basic' initialValue={'a'} type='list' values={listValues} />
    <Row title='Error' initialValue={'a'} type='list' values={listValues} error={true} />
    <Row title='Nullable' initialValue={'a'} type='list' values={listValues} nullable={true} />
    <Row title='Disabled' initialValue={'a'} type='list' values={listValues} enabled={false} />
    <Row title='Readonly' initialValue={'a'} type='list' values={listValues} readOnly={true} />

  </components.Container>
);

Editors.meta = {
  menu: 'Components',
  icon: null,
  title: 'Editors'
};

export default Editors;
