'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';

class Reference extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tab: 'capacities' };
  }

  render() {
    return (
      <base.SelectableList selectedNode={{value: this.state.tab}}
                selectedValueChanged={(obj) => this.setState({ tab: obj.value })}>
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
  }
}

export default Reference;