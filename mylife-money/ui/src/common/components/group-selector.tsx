import Breadcrumbs from '@mui/material/Breadcrumbs';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { getGroupStack } from '../../reference/selectors';
import { useAppSelector } from '../../store-api';
import icons from '../icons';
import GroupSelectorButton from './group-selector-button';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const GroupPath = styled(Breadcrumbs)(({ theme }) => ({
  flex: '1 1 auto',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

export interface GroupSelectorProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'children'> {
  onChange: (value: string | null) => void;
  value: string | null;
}

export default function GroupSelector({ onChange, value, ...props }: GroupSelectorProps) {
  const stack = useAppSelector((state) => getGroupStack(state, value));
  return (
    <Container {...props}>
      <Tooltip title="Sélectionner">
        <GroupSelectorButton onSelect={onChange}>
          <icons.actions.Move />
        </GroupSelectorButton>
      </Tooltip>
      <GroupPath aria-label="breadcrumb">
        {stack.map((node) => (
          <Typography key={node._id} color="textPrimary">
            {node.display}
          </Typography>
        ))}
      </GroupPath>
    </Container>
  );
}
