import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { Group } from '../../../api';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import icons from '../../../common/icons';
import { useCallback } from 'react';

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

export interface GroupBreadcrumbsProps {
  groupStack?: Group[];
  onMove: (groupId: string) => void;
  onOpenGroup: (groupId: string) => void;
}

export default function GroupBreadcrumbs({ groupStack, onMove, onOpenGroup }: GroupBreadcrumbsProps) {
  return (
    <Container>
      <Tooltip title={"Déplacer l'opération"}>
        <div>
          <GroupSelectorButton onSelect={onMove}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </Tooltip>

      <GroupPath aria-label="breadcrumb">
        {groupStack.map((group) => (
          <GroupNode key={group._id} group={group} onOpenGroup={onOpenGroup} />
        ))}
      </GroupPath>
    </Container>
  );
}

interface GroupNodeProps {
  group: Group;
  onOpenGroup: (groupId: string) => void;
}

function GroupNode({ group, onOpenGroup }: GroupNodeProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onOpenGroup(group._id);
    },
    [group._id, onOpenGroup]
  );

  return (
    <Link color="textPrimary" href="#" onClick={handleClick}>
      {group.display}
    </Link>
  );
}
