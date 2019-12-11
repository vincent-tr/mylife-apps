'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import base from '../base/index';

const TypeList = ({ value, onChange }) => (
  <base.SelectableList selectedNode={{value}}
            selectedValueChanged={(obj) => onChange(obj.value)}>
    <base.SelectableListItem value={{ value: 'capacities'}} primaryText="Capacites de bouteilles"/>
    <base.SelectableListItem value={{ value: 'dishes'}}     primaryText="Plats"/>
    <base.SelectableListItem value={{ value: 'regions'}}    primaryText="Regions"/>
    <base.SelectableListItem value={{ value: 'types'}}      primaryText="Types"/>
  </base.SelectableList>
);

TypeList.propTypes = {
  value    : PropTypes.string,
  onChange : PropTypes.func.isRequired
};

export default TypeList;