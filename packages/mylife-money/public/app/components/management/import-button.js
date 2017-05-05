'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
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

  handleRequestChange(value) {
    this.setState({ open: value });
  }

  handleMenuClick(value) {
    this.handleRequestChange(false);
    this.setState({ account: value });
    this.fileInput.click();
  }

  render() {
    const { accounts, style } = this.props;
    const { open } = this.state;
    return (
    <div>
      <mui.IconMenu open={open}
                    onRequestChange={(open) => this.handleRequestChange(open)}
                    useLayerForClickAway={true}
                    iconButtonElement={<mui.IconButton tooltip="Importer des opérations" style={style}><icons.actions.Import /></mui.IconButton>}>
        {accounts.map(account => (<mui.MenuItem key={account.id}
                                                onClick={() => this.handleMenuClick(account.id)}
                                                primaryText={account.display}
                                                leftIcon={<icons.Account />} />))}
      </mui.IconMenu>

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
