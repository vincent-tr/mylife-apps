import IconButton from '@mui/material/IconButton';
import { default as MuiToolbar } from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dialogs } from 'mylife-tools';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import icons from '../../../common/icons';
import { getGroup } from '../../../reference/selectors';
import { getSelectedGroupId, createGroup, updateGroup, deleteGroup } from '../../store';
import groupEditor from './group-editor';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector((state) => {
      const selected = getSelectedGroupId(state);
      return {
        group: selected && (getGroup(state, selected) as FIXME_any),
        canChange: !!selected,
      };
    }),
    ...useMemo(
      () => ({
        onGroupCreate: () => dispatch(createGroup()),
        onGroupEdit: (group) => dispatch(updateGroup(group)),
        onGroupDelete: () => dispatch(deleteGroup()),
      }),
      [dispatch]
    ),
  };
};

const styles = {
  icon: {
    margin: 16,
  },
  button: {
    height: '56px',
    width: '56px',
    overflow: 'inherit',
  },
};

const Toolbar = () => {
  const { group, onGroupCreate, onGroupEdit, onGroupDelete, canChange } = useConnect();

  const handleDelete = async () => {
    if (await dialogs.confirm({ title: 'Supprimer le groupe ?' })) {
      onGroupDelete();
    }
  };

  const handleEdit = async () => {
    const res = await groupEditor(group);
    if (res) {
      onGroupEdit(res);
    }
  };

  const handleMove = (parent) => {
    onGroupEdit({ ...group, parent });
  };

  const moveOptions = group && {
    selectedGroupId: group.parent,
    disabledGroupIds: [group._id],
  };

  return (
    <MuiToolbar>
      <Tooltip title="Créer un groupe enfant">
        <IconButton onClick={onGroupCreate} style={styles.button}>
          <icons.actions.New />
        </IconButton>
      </Tooltip>

      <Tooltip title="Editer le groupe">
        <div>
          <IconButton onClick={handleEdit} disabled={!canChange} style={styles.button}>
            <icons.actions.Edit />
          </IconButton>
        </div>
      </Tooltip>

      <Tooltip title="Déplacer le groupe">
        <div>
          <GroupSelectorButton onSelect={handleMove} disabled={!canChange} style={styles.button} options={moveOptions}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </Tooltip>

      <Tooltip title="Supprimer le groupe">
        <div>
          <IconButton onClick={handleDelete} disabled={!canChange} style={styles.button}>
            <icons.actions.Delete />
          </IconButton>
        </div>
      </Tooltip>
    </MuiToolbar>
  );
};

export default Toolbar;
