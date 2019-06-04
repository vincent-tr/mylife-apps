'use strict';

import { React, PropTypes, mui, useSelector } from 'mylife-tools-ui';
import { getAccounts } from '../../selectors/accounts';

const useConnect = () => useSelector(state => ({
  accounts : getAccounts(state),
}));

const NULL_VALUE='<null>';

function renderList(accounts, allowNull) {
  if(allowNull) {
    accounts = [{ id: NULL_VALUE, display: 'Tous' }].concat(accounts);
  }
  return accounts.map(account => (<mui.MenuItem key={account.id} value={account.id} primaryText={account.display} />));
}

const AccountSelector = ({ allowNull, value, onChange, ...props }) => {
  const { accounts } = useConnect();
  return (
    <mui.Select value={value || NULL_VALUE} onChange={(event, index, value) => onChange(value === NULL_VALUE ? null : value)} {...props}>
      {renderList(accounts, allowNull)}
    </mui.Select>
  );
};

AccountSelector.propTypes = {
  allowNull : PropTypes.bool.isRequired,
  value     : PropTypes.string,
  onChange  : PropTypes.func.isRequired,
};

export default AccountSelector;
