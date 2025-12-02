import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import { getAccounts } from '../../reference/selectors';
import { useAppSelector } from '../../store';

const useConnect = () =>
  useAppSelector((state) => ({
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

export interface AccountSelectorProps extends Omit<SelectProps, 'value' | 'onChange' | 'variant'> {
  allowNull?: boolean;
  value?: string | null;
  onChange?: (value: string | null) => void;
}

export default function AccountSelector({ allowNull = false, value, onChange, ...props }: AccountSelectorProps) {
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
}
