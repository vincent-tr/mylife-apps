'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';

function renderList(accounts, allowNull) {
  if(allowNull) {
    accounts = [{ id: null, display: 'Tous' }].concat(accounts);
  }
  return accounts.map(account => (<mui.MenuItem key={account.id} value={account.id} primaryText={account.display} />));
}

const AccountSelector = ({ accounts, allowNull, value, onChange, ...props }) => (
  <mui.SelectField value={value} onChange={(event, index, value) => onChange(value)} {...props}>
    {renderList(accounts, allowNull)}
  </mui.SelectField>
);

AccountSelector.propTypes = {
  accounts  : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  allowNull : PropTypes.bool.isRequired,
  value     : PropTypes.string,
  onChange  : PropTypes.func.isRequired,
};

export default AccountSelector;
