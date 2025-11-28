import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { Component, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import icons from '../../../common/icons';
import { getGroup } from '../../../reference/selectors';
import { getSelectedGroupId, selectGroup } from '../../store';

type FIXME_any = any;

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const Label = styled(Typography)(({ theme }) => ({
  flex: '1 1 auto',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector((state) => ({
      selectedGroup: getGroup(state, getSelectedGroupId(state)),
    })),
    ...useMemo(
      () => ({
        onSelect: (id) => dispatch(selectGroup(id)),
      }),
      [dispatch]
    ),
  };
};

export type GroupDenseSelectorProps = Omit<React.ComponentProps<'div'>, 'children'>;

export default function GroupDenseSelector(props: GroupDenseSelectorProps) {
  const { selectedGroup, onSelect } = useConnect();

  return (
    <Container {...props}>
      <Tooltip title={"Déplacer l'opération"}>
        <div>
          <GroupSelectorButton onSelect={onSelect}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </Tooltip>
      <Label>{(selectedGroup as FIXME_any).display}</Label>
    </Container>
  );
}
