'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

import GroupMenuItemContainer from '../../containers/management/group-menu-item-container';

const styles = {
  button: {
    height: 56,
    width: 56,
    overflow: 'inherit'
  },
  date: {
    width: 100
  }
};

class MoveButton extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };
  }

  handleRequestChange(value) {
    this.setState({ open: value });
  }

  render() {
    const { enabled, rootGroups } = this.props;
    const { open } = this.state;
    return (
      <mui.IconMenu open={open}
                    onRequestChange={(open) => this.handleRequestChange(open)}
                    useLayerForClickAway={true}
                    iconButtonElement={
                      <mui.IconButton tooltip="Déplacer"
                                      style={styles.button}
                                      disabled={!enabled}>
                        <icons.actions.Move />
                      </mui.IconButton>
                    }>
        {rootGroups.map((group) => (<GroupMenuItemContainer key={group.id} group={group} onRequestClose={() => this.handleRequestChange(false)} />))}
      </mui.IconMenu>
    );
  }
}

MoveButton.propTypes = {
  enabled    : React.PropTypes.bool.isRequired,
  rootGroups : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default MoveButton;
