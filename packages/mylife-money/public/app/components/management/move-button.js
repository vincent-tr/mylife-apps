'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

import GroupMenuItemContainer from '../../containers/management/group-menu-item-container';

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
    const { enabled, rootGroups, style } = this.props;
    const { open } = this.state;
    return (
      <mui.IconMenu open={open}
                    onRequestChange={(open) => this.handleRequestChange(open)}
                    useLayerForClickAway={true}
                    iconButtonElement={
                      <mui.IconButton tooltip="Déplacer"
                                      style={style}
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
  style      : React.PropTypes.object,
  enabled    : React.PropTypes.bool.isRequired,
  rootGroups : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default MoveButton;
