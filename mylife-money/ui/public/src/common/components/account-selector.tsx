import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getAccounts } from '../../reference/selectors';
import { MenuItem, Select } from '@mui/material';

const useConnect = () =>
  useSelector((state) => ({
    accounts: getAccounts(state),
  }));

function renderList(accounts, allowNull) {
  if (allowNull) {
    accounts = [{ _id: '', display: 'Tous' }, ...accounts];
  }
  return accounts.map((account) => (
    <MenuItem key={account._id} value={account._id}>
      {account.display}
    </MenuItem>
  ));
}

const AccountSelector = ({ allowNull = false, value, onChange = null, ...props }) => {
  const { accounts } = useConnect();
  const handleChange = (e) => {
    const { value } = e.target;
    onChange(value === '' ? null : value);
  };
  return (
    <Select displayEmpty value={value || ''} onChange={handleChange} inputProps={{ readOnly: !onChange }} {...props}>
      {renderList(accounts, allowNull)}
    </Select>
  );
};

AccountSelector.propTypes = {
  allowNull: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default AccountSelector;
