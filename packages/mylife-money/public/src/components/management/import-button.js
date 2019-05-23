'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';
import icons from '../icons';

class Header extends React.Component {

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
    this.handleRequestChange(false);
    this.setState({ account: value, anchorEl: null });
    this.fileInput.click();
  }

  render() {
    const { accounts, style } = this.props;
    const { anchorEl } = this.state;
    return (
    <div>
      <mui.IconButton
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        onClick={this.handleClick}
        tooltip="Importer des opérations"
        style={style}>
        <icons.actions.Import />
      </mui.IconButton>

      <mui.Menu id="simple-menu" anchorEl={anchorEl} open={!!anchorEl} onClose={this.handleClose}>
        {accounts.map(account => (<mui.MenuItem key={account.id}
                                                onClick={() => this.handleMenuClick(account.id)}
                                                primaryText={account.display}
                                                leftIcon={<icons.Account />} />))}
      </mui.Menu>

      <input
        ref={(input) => { this.fileInput = input; }}
        type="file"
        style={{display : 'none'}}
        onChange={(e) => this.fileSelect(e)}/>
    </div>

    );
  }
}

Header.propTypes = {
  style    : PropTypes.object,
  accounts : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onImport : PropTypes.func.isRequired
};

export default Header;
