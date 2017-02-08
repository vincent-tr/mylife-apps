'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

import GroupMenuItemContainer from '../../containers/management/group-menu-item-container';

const styles = {
  button: {
    height : 47,
    width  : 47,
    margin : 0
  }
};

const GroupMenuItem = ({ group, children, onSelect, onRequestClose }) => (
  <mui.MenuItem primaryText={group.display}
                leftIcon={
                  <mui.IconButton tooltip="Déplacer ici"
                                  tooltipPosition="top-right"
                                  onClick={() => { onRequestClose(); onSelect(); } }
                                  style={styles.button}>
                    <icons.Group />
                  </mui.IconButton>
                }
                menuItems={children.length && children.map((child) => (<GroupMenuItemContainer key={child.id} group={child} onRequestClose={onRequestClose} />))} />
);

GroupMenuItem.propTypes = {
  group          : React.PropTypes.object.isRequired,
  children       : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  onSelect       : React.PropTypes.func.isRequired,
  onRequestClose : React.PropTypes.func.isRequired,
};

export default GroupMenuItem;
