'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

const styles = {
  icon: {
    margin: 16,
  },
  button: {
    height: '56px',
    width: '56px',
    overflow: 'inherit'
  }
};

const Toolbar = ({ onGroupCreate, onGroupEdit, onGroupDelete }) => (
  <mui.Toolbar>
    <mui.ToolbarGroup>

      <mui.IconButton tooltip="Créer un groupe enfant"
                      tooltipPosition="top-right"
                      onClick={onGroupCreate}
                      style={styles.button}>
        <icons.actions.New />
      </mui.IconButton>

      <mui.IconButton tooltip="Editer le groupe"
                      tooltipPosition="top-right"
                      onClick={onGroupEdit}
                      style={styles.button}>
        <icons.actions.Edit />
      </mui.IconButton>

      <mui.IconButton tooltip="Supprimer le groupe"
                      tooltipPosition="top-right"
                      onClick={onGroupDelete}
                      style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>

    </mui.ToolbarGroup>
  </mui.Toolbar>
);

Toolbar.propTypes = {
  onGroupCreate : React.PropTypes.func.isRequired,
  onGroupEdit   : React.PropTypes.func.isRequired,
  onGroupDelete : React.PropTypes.func.isRequired
};

export default Toolbar;
