'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import base from '../base/index';
import icons from '../icons';

const TypeList = ({ value, onChange }) => (
  <base.SelectableList selectedNode={{value}}
            selectedValueChanged={(obj) => onChange(obj.value)}>
    <base.SelectableListItem value={{ value: 'capacities'}}
      leftIcon={
        <base.TooltipContainer tooltip="Capacites de bouteilles">
          <icons.tabs.Management />
        </base.TooltipContainer>
      }
      primaryText="Capacites de bouteilles"/>
    <base.SelectableListItem value={{ value: 'dishes'}}
      leftIcon={
        <base.TooltipContainer tooltip="Plats">
          <icons.tabs.Management />
        </base.TooltipContainer>
      }
      primaryText="Plats"/>
    <base.SelectableListItem value={{ value: 'regions'}}
      leftIcon={
        <base.TooltipContainer tooltip="Regions">
          <icons.tabs.Management />
        </base.TooltipContainer>
      }
      primaryText="Regions"/>
    <base.SelectableListItem value={{ value: 'types'}}
      leftIcon={
        <base.TooltipContainer tooltip="Types">
          <icons.tabs.Management />
        </base.TooltipContainer>
      }
      primaryText="Types"/>
  </base.SelectableList>
);

TypeList.propTypes = {
  value    : PropTypes.string,
  onChange : PropTypes.func.isRequired
};

export default TypeList;