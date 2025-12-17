import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import icons from '../../../common/icons';
import { getAccounts } from '../../../reference/selectors';
import { useAppAction, useAppSelector } from '../../../store-api';
import { importOperations } from '../../store';

export default function ImportButton() {
  const accounts = useAppSelector(getAccounts);
  const onImport = useAppAction(importOperations);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuClick = React.useCallback((accountId: string) => {
    setSelectedAccount(accountId);
    setAnchorEl(null);
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || !selectedAccount) {
        return;
      }
      onImport({ account: selectedAccount, file });
    },
    [onImport, selectedAccount]
  );

  return (
    <div>
      <Tooltip title="Importer des opérations">
        <IconButton aria-owns={anchorEl ? 'simple-menu' : undefined} aria-haspopup="true" onClick={handleClick}>
          <icons.actions.Import />
        </IconButton>
      </Tooltip>

      <Menu id="simple-menu" anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        {accounts.map((account) => (
          <MenuItem key={account._id} onClick={() => handleMenuClick(account._id)}>
            <ListItemIcon>
              <icons.Account />
            </ListItemIcon>
            <Typography variant="inherit">{account.display}</Typography>
          </MenuItem>
        ))}
      </Menu>

      <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileSelect} />
    </div>
  );
}
