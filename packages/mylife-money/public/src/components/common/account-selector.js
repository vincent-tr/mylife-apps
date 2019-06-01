'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';

const NULL_VALUE='<null>';

function renderList(accounts, allowNull) {
  if(allowNull) {
    accounts = [{ id: NULL_VALUE, display: 'Tous' }].concat(accounts);
  }
  return accounts.map(account => (<mui.MenuItem key={account.id} value={account.id} primaryText={account.display} />));
}

const AccountSelector = ({ accounts, allowNull, value, onChange, ...props }) => (
  <mui.Select value={value || NULL_VALUE} onChange={(event, index, value) => onChange(value === NULL_VALUE ? null : value)} {...props}>
    {renderList(accounts, allowNull)}
  </mui.Select>
);

AccountSelector.propTypes = {
  accounts  : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  allowNull : PropTypes.bool.isRequired,
  value     : PropTypes.string,
  onChange  : PropTypes.func.isRequired,
};

export default AccountSelector;
