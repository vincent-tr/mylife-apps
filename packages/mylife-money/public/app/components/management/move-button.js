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

const Header = ({
  enabled,
  rootGroups
}) => (
  <mui.IconMenu useLayerForClickAway={true} iconButtonElement={
    <mui.IconButton tooltip="Déplacer"
                    style={styles.button}
                    disabled={!enabled}>
      <icons.actions.Move />
    </mui.IconButton>
  }>
  {rootGroups.map((group) => (<GroupMenuItemContainer key={group.id} group={group} />))}
  </mui.IconMenu>
);

Header.propTypes = {
  enabled    : React.PropTypes.bool.isRequired,
  rootGroups : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default Header;
