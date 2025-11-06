'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import icons from '../../../common/icons';
import { Tooltip, IconButton, Menu, MenuItem, ListItemIcon, Typography } from '@material-ui/core';

interface HeaderProps {
  onImport;
  accounts;
}

class Header extends React.Component<HeaderProps, { account?; anchorEl?; open; }> {
  private fileInput;

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };
  }

  fileSelect(e) {
    const { onImport } = this.props;
    e.stopPropagation();
    const file = e.target.files[0];
    e.target.value = '';
    if(!file) { return; }
    onImport(this.state.account, file);
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  handleMenuClick(value) {
    this.setState({ account: value, anchorEl: null });
    this.fileInput.click();
  }

  render() {
    const { accounts } = this.props;
    const { anchorEl } = this.state;
    return (
    <div>
      <Tooltip title='Importer des opérations'>
        <IconButton
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup='true'
          onClick={this.handleClick}>
          <icons.actions.Import />
        </IconButton>
      </Tooltip>

      <Menu id="simple-menu" anchorEl={anchorEl} open={!!anchorEl} onClose={this.handleClose}>
        {accounts.map(account => (
          <MenuItem key={account._id} onClick={() => this.handleMenuClick(account._id)}>
            <ListItemIcon>
              <icons.Account />
            </ListItemIcon>
            <Typography variant='inherit'>
              {account.display}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      <input
        ref={(input) => { this.fileInput = input; }}
        type="file"
        style={{display : 'none'}}
        onChange={(e) => this.fileSelect(e)}/>
    </div>

    );
  }

  static propTypes = {
    accounts : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onImport : PropTypes.func.isRequired
  };
}

export default Header;
