import React from 'react';
import PropTypes from 'prop-types';
import icons from '../../../common/icons';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import Tooltip from '@mui/material/Tooltip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

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

const GroupBreadcrumbs = ({ groupStack, onMove, onOpenGroup }) => {
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
        {groupStack.map((group) => {
          const handleClick = (e) => {
            e.preventDefault();
            onOpenGroup(group._id);
          };

          return (
            <Link key={group._id} color="textPrimary" href="#" onClick={handleClick}>
              {group.display}
            </Link>
          );
        })}
      </GroupPath>
    </Container>
  );
};

GroupBreadcrumbs.propTypes = {
  groupStack: PropTypes.array,
  onMove: PropTypes.func.isRequired,
  onOpenGroup: PropTypes.func.isRequired,
};

export default GroupBreadcrumbs;
