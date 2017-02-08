'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';
import base from '../base/index';

import MoveButton from './move-button';

const styles = {
  button: {
    height: 56,
    width: 56,
    overflow: 'inherit'
  },
  date: {
    width: 100
  }
};

const Header = ({
  canMove,
  rootGroups,
  accounts,
  minDate, maxDate, account,
  onMinDateChanged, onMaxDateChanged, onAccountChanged, onOperationsImport
}) => (
  <mui.Toolbar>
    <mui.ToolbarGroup>
      <base.IconFileButton tooltip="Importer des operations"
                           style={styles.button}
                           onFileSelected={onOperationsImport}>
        <icons.actions.Import />
      </base.IconFileButton>
      <MoveButton enabled={canMove} rootGroups={rootGroups} />
    </mui.ToolbarGroup>
    <mui.ToolbarGroup>
      <p>Date début</p>
      <mui.IconButton tooltip="Pas de date de début"
                      onClick={() => onMinDateChanged(null)}
                      style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>
      <mui.DatePicker id="minDate" value={minDate} onChange={(event, date) => onMinDateChanged(date)} textFieldStyle={styles.date} />
    </mui.ToolbarGroup>

    <mui.ToolbarGroup>
      <p>Date fin</p>
      <mui.IconButton tooltip="Pas de date de fin"
                      onClick={() => onMaxDateChanged(null)}
                      style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>
      <mui.DatePicker id="maxDate" value={maxDate} onChange={(event, date) => onMaxDateChanged(date)} textFieldStyle={styles.date} />
    </mui.ToolbarGroup>

    <mui.ToolbarGroup>
      <p>Compte</p>
      <mui.SelectField value={account} onChange={(event, index, value) => onAccountChanged(value)} width={200}>
        {([{ id: null, display: 'Tous' }].concat(accounts)).map(account => (<mui.MenuItem key={account.id} value={account.id} primaryText={account.display} />))}
      </mui.SelectField>
    </mui.ToolbarGroup>
  </mui.Toolbar>
);

Header.propTypes = {
  canMove            : React.PropTypes.bool.isRequired,
  rootGroups         : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  accounts           : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  minDate            : React.PropTypes.instanceOf(Date),
  maxDate            : React.PropTypes.instanceOf(Date),
  account            : React.PropTypes.string,
  onMinDateChanged   : React.PropTypes.func.isRequired,
  onMaxDateChanged   : React.PropTypes.func.isRequired,
  onAccountChanged   : React.PropTypes.func.isRequired,
  onOperationsImport : React.PropTypes.func.isRequired,
};

export default Header;
