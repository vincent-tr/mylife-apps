'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import { mui } from 'mylife-tools-ui';
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
    this.setState({ account: value, anchorEl: null });
    this.fileInput.click();
  }

  render() {
    const { accounts } = this.props;
    const { anchorEl } = this.state;
    return (
    <div>
      <mui.Tooltip title='Importer des opérations'>
        <mui.IconButton
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup='true'
          onClick={this.handleClick}>
          <icons.actions.Import />
        </mui.IconButton>
      </mui.Tooltip>

      <mui.Menu id="simple-menu" anchorEl={anchorEl} open={!!anchorEl} onClose={this.handleClose}>
        {accounts.map(account => (
          <mui.MenuItem key={account._id} onClick={() => this.handleMenuClick(account._id)}>
            <mui.ListItemIcon>
              <icons.Account />
            </mui.ListItemIcon>
            <mui.Typography variant='inherit'>
              {account.display}
            </mui.Typography>
          </mui.MenuItem>
        ))}
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
  accounts : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onImport : PropTypes.func.isRequired
};

export default Header;
