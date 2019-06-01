'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';
import icons from '../icons';
import base from '../base/index';
import groupEditor from './group-editor';

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

const Toolbar = ({ group, onGroupCreate, onGroupEdit, onGroupDelete, canChange }) => (
  <mui.Toolbar>

    <mui.IconButton tooltip="Créer un groupe enfant"
                    onClick={onGroupCreate}
                    style={styles.button}>
      <icons.actions.New />
    </mui.IconButton>

    <mui.IconButton tooltip="Editer le groupe"
                    onClick={() => groupEditor(group, (err, group) => onGroupEdit(group))}
                    disabled={!canChange}
                    style={styles.button}>
      <icons.actions.Edit />
    </mui.IconButton>

    <mui.IconButton tooltip="Supprimer le groupe"
                    onClick={() => base.confirm({ lines: ['Supprimer le groupe ?'], proceed: onGroupDelete })}
                    disabled={!canChange}
                    style={styles.button}>
      <icons.actions.Delete />
    </mui.IconButton>

  </mui.Toolbar>
);

Toolbar.propTypes = {
  group         : PropTypes.object,
  onGroupCreate : PropTypes.func.isRequired,
  onGroupEdit   : PropTypes.func.isRequired,
  onGroupDelete : PropTypes.func.isRequired,
  canChange     : PropTypes.bool.isRequired
};

export default Toolbar;
