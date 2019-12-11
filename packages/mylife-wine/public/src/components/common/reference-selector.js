'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';

function renderName(nameRender, item) {
  return nameRender ? nameRender(item) : item.name;
}

function createSelectedItem(nameRender, list, value) {
  if(!value) {
    return (<mui.MenuItem primaryText="-" />);
  }
  const item = list.find(item => item.id === value);
  return (<mui.MenuItem primaryText={renderName(nameRender, item)} leftIcon={<base.DataImage data={item.icon}/>} />);
}

const ReferenceSelector = ({ nameRender, list, value, onChange, ...props }) => (
  <mui.DropDownMenu { ...props }
    value={value}
    onChange={onChange}
    selectionRenderer={value => createSelectedItem(nameRender, list, value)}>
    <mui.MenuItem value={null} primaryText="-" />
    {list.map(item => (<mui.MenuItem key={item.id} value={item.id} primaryText={renderName(nameRender, item)} leftIcon={<base.DataImage data={item.icon}/>} />))}
  </mui.DropDownMenu>
);

ReferenceSelector.propTypes = {
  list       : PropTypes.arrayOf(PropTypes.object),
  value      : PropTypes.string,
  onChange   : PropTypes.func.isRequired,
  nameRender : PropTypes.func
};

export default ReferenceSelector;
