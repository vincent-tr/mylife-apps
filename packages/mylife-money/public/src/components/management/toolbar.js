'use strict';

import { React, useMemo, mui, useSelector, useDispatch } from 'mylife-tools-ui';
import icons from '../icons';
import base from '../base';
import groupEditor from './group-editor';
import { getGroup } from '../../selectors/groups';
import { getSelectedGroupId } from '../../selectors/management';
import { createGroup, updateGroup, deleteGroup } from '../../actions/management';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => {
      const selected = getSelectedGroupId(state);
      return {
        group     : selected && getGroup(state, { group: selected }),
        canChange : !!selected
      };
    }),
    ...useMemo(() => ({
      onGroupCreate   : () => dispatch(createGroup()),
      onGroupEdit     : (group) => dispatch(updateGroup(group)),
      onGroupDelete   : () => dispatch(deleteGroup())
    }), [dispatch])
  };
};

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

const Toolbar = () => {
  const { group, onGroupCreate, onGroupEdit, onGroupDelete, canChange } = useConnect();
  return (
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
};

export default Toolbar;
