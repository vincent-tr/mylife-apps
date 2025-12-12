import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import { useCallback, useMemo } from 'react';
import { getAccounts } from '../../reference/selectors';
import { useAppSelector } from '../../store-api';

export interface AccountSelectorProps extends Omit<SelectProps, 'value' | 'onChange' | 'variant'> {
  allowNull?: boolean;
  value?: string | null;
  onChange?: (value: string | null) => void;
}

export default function AccountSelector({ allowNull = false, value, onChange, ...props }: AccountSelectorProps) {
  const accounts = useAppSelector(getAccounts);

  const list = useMemo(() => {
    if (allowNull) {
      return [{ _id: '', _entity: 'account', code: 'all', display: 'Tous' }, ...accounts];
    } else {
      return accounts;
    }
  }, [accounts, allowNull]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      onChange(value === '' ? null : value);
    },
    [onChange]
  );

  return (
    <Select displayEmpty value={value || ''} onChange={handleChange} inputProps={{ readOnly: !onChange }} {...props}>
      {list.map((account) => (
        <MenuItem key={account._id} value={account._id}>
          {account.display}
        </MenuItem>
      ))}
    </Select>
  );
}
