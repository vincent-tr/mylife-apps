import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import icons from '../../../common/icons';
import { getGroup } from '../../../reference/selectors';
import { useAppSelector, useAppDispatch } from '../../../store-api';
import { getSelectedGroupId, selectGroup } from '../../store';

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
  const dispatch = useAppDispatch();
  return {
    ...useAppSelector((state) => ({
      selectedGroup: getGroup(state, getSelectedGroupId(state)),
    })),
    ...useMemo(
      () => ({
        onSelect: (groupId: string) => dispatch(selectGroup(groupId)),
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
      <Label>{selectedGroup.display}</Label>
    </Container>
  );
}
