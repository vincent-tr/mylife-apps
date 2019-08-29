'use strict';

import { React, useMemo, mui, useSelector, useDispatch, dialogs } from 'mylife-tools-ui';
import icons from '../../../common/icons';
import groupEditor from './group-editor';
import { getGroup } from '../../../reference/selectors';
import { getSelectedGroupId } from '../../selectors';
import { createGroup, updateGroup, deleteGroup } from '../../actions';
import GroupSelectorButton from '../../../common/components/group-selector-button';

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

  const handleDelete = async() => {
    if(await dialogs.confirm({ title: 'Supprimer le groupe ?' })) {
      onGroupDelete();
    }
  };

  const handleEdit = async() => {
    const res = await groupEditor(group);
    if(res) {
      onGroupEdit(res);
    }
  };

  const handleMove = (parent) => {
    onGroupEdit({ ... group, parent });
  };

  const moveOptions = group && {
    selectedGroupId: group.parent,
    disabledGroupIds: [group._id]
  };

  return (
    <mui.Toolbar>

      <mui.Tooltip title='Créer un groupe enfant'>
        <mui.IconButton onClick={onGroupCreate} style={styles.button}>
          <icons.actions.New />
        </mui.IconButton>
      </mui.Tooltip>

      <mui.Tooltip title='Editer le groupe'>
        <div>
          <mui.IconButton onClick={handleEdit} disabled={!canChange} style={styles.button}>
            <icons.actions.Edit />
          </mui.IconButton>
        </div>
      </mui.Tooltip>

      <mui.Tooltip title='Déplacer le groupe'>
        <div>
          <GroupSelectorButton onSelect={handleMove} disabled={!canChange} style={styles.button} options={moveOptions}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </mui.Tooltip>

      <mui.Tooltip title='Supprimer le groupe'>
        <div>
          <mui.IconButton onClick={handleDelete} disabled={!canChange} style={styles.button}>
            <icons.actions.Delete />
          </mui.IconButton>
        </div>
      </mui.Tooltip>

    </mui.Toolbar>
  );
};

export default Toolbar;
