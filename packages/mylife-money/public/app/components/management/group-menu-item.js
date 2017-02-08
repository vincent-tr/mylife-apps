'use strict';

import React from 'react';
import * as mui from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import icons from '../icons';

import GroupMenuItemContainer from '../../containers/management/group-menu-item-container';

function getStyles(muiTheme) {
  return {
    button: {
      height : 47,
      width  : 47,
      margin : 0
    },
    rightIcon: {
      margin : 0,
      right  : 24,
      top    : 4,
      fill   : muiTheme.menuItem.rightIconDesktopFill,
    }
  };
}

const GroupMenuItem = ({ muiTheme, group, children, onSelect, onRequestClose }) => {
  const styles = getStyles(muiTheme);
  return (
    <mui.MenuItem primaryText={group.display}
                  leftIcon={
                    <mui.IconButton tooltip="Déplacer ici"
                                    tooltipPosition="top-right"
                                    onClick={() => { onRequestClose(); onSelect(); } }
                                    style={styles.button}>
                      <icons.Group />
                    </mui.IconButton>
                  }
                  rightIcon={(children.length || null) && <icons.utils.ArrowDropRight />}
                  menuItems={(children.length || null) && children.map((child) => (<GroupMenuItemContainer key={child.id} group={child} onRequestClose={onRequestClose} />))} />
  );
};

GroupMenuItem.propTypes = {
  muiTheme       : React.PropTypes.object.isRequired,
  group          : React.PropTypes.object.isRequired,
  children       : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  onSelect       : React.PropTypes.func.isRequired,
  onRequestClose : React.PropTypes.func.isRequired,
};

export default muiThemeable()(GroupMenuItem);
