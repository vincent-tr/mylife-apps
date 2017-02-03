'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

const styles = {
  button: {
    height: 56,
    width: 56,
    overflow: 'inherit'
  }
};

const Header = ({
  minDate, maxDate, account,
  onMinDateChanged, onMaxDateChanged, onAccountChanged
}) => (
  <mui.Toolbar>
    <mui.ToolbarGroup>
      <p>Date début</p>
      &nbsp;
      <mui.IconButton tooltip="Pas de date de début"
                      onClick={() => onMinDateChanged(null)}
                      style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>
      <mui.DatePicker id="minDate" value={minDate} onChange={(event, date) => onMinDateChanged(date)} />
    </mui.ToolbarGroup>

    <mui.ToolbarGroup>
      <p>Date fin</p>
      &nbsp;
      <mui.IconButton tooltip="Pas de date de fin"
                      onClick={() => onMaxDateChanged(null)}
                      style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>
      <mui.DatePicker id="maxDate" value={maxDate} onChange={(event, date) => onMaxDateChanged(date)} />
    </mui.ToolbarGroup>

    <mui.ToolbarGroup>
      <p>Compte</p>
      &nbsp;
    </mui.ToolbarGroup>
  </mui.Toolbar>
);

Header.propTypes = {
  minDate          : React.PropTypes.instanceOf(Date),
  maxDate          : React.PropTypes.instanceOf(Date),
  account          : React.PropTypes.string,
  onMinDateChanged : React.PropTypes.func.isRequired,
  onMaxDateChanged : React.PropTypes.func.isRequired,
  onAccountChanged : React.PropTypes.func.isRequired
};

export default Header;
