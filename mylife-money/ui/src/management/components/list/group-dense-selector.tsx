import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import icons from '../../../common/icons';
import { useAppSelector, useAppAction } from '../../../store-api';
import { getSelectedGroup, selectGroup } from '../../store';

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

export type GroupDenseSelectorProps = Omit<React.ComponentProps<'div'>, 'children'>;

export default function GroupDenseSelector(props: GroupDenseSelectorProps) {
  const selectedGroup = useAppSelector(getSelectedGroup);
  const onSelect = useAppAction(selectGroup);

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
