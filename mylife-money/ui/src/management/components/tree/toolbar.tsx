import IconButton from '@mui/material/IconButton';
import { default as MuiToolbar } from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { useCallback, useMemo } from 'react';
import { dialogs } from 'mylife-tools';
import { Group } from '../../../api';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import icons from '../../../common/icons';
import { getGroup } from '../../../reference/selectors';
import { useAppSelector, useAppDispatch } from '../../../store-api';
import { getSelectedGroupId, createGroup, updateGroup, deleteGroup } from '../../store';
import groupEditor from './group-editor';

const useConnect = () => {
  const dispatch = useAppDispatch();
  return {
    ...useAppSelector((state) => {
      const selected = getSelectedGroupId(state);
      return {
        group: selected && getGroup(state, selected),
        canChange: !!selected,
      };
    }),
    ...useMemo(
      () => ({
        onGroupCreate: () => dispatch(createGroup()),
        onGroupEdit: (group: Group) => dispatch(updateGroup(group)),
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

export default function Toolbar() {
  const { group, onGroupCreate, onGroupEdit, onGroupDelete, canChange } = useConnect();

  const handleDelete = useCallback(async () => {
    if (await dialogs.confirm({ title: 'Supprimer le groupe ?' })) {
      onGroupDelete();
    }
  }, [onGroupDelete]);

  const handleEdit = useCallback(async () => {
    const res = await groupEditor(group);
    if (res) {
      onGroupEdit(res);
    }
  }, [group, onGroupEdit]);

  const handleMove = useCallback(
    (parent: string) => {
      onGroupEdit({ ...group, parent });
    },
    [group, onGroupEdit]
  );

  const moveOptions = useMemo(
    () =>
      group && {
        selectedGroupId: group.parent,
        disabledGroupIds: [group._id],
      },
    [group]
  );

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
}
