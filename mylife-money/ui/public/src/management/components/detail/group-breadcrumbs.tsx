'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import icons from '../../../common/icons';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import { Tooltip, Breadcrumbs, Link, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  breadcrumbs: {
    flex: '1 1 auto',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const GroupBreadcrumbs = ({ groupStack, onMove, onOpenGroup }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Tooltip title={'Déplacer l\'opération'}>
        <div>
          <GroupSelectorButton onSelect={onMove}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </Tooltip>

      <Breadcrumbs aria-label='breadcrumb' className={classes.breadcrumbs}>
        {groupStack.map(group => {
          const handleClick = e => {
            e.preventDefault();
            onOpenGroup(group._id);
          };

          return (
            <Link key={group._id} color='textPrimary' href='#' onClick={handleClick}>
              {group.display}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

GroupBreadcrumbs.propTypes = {
  groupStack: PropTypes.array,
  onMove: PropTypes.func.isRequired,
  onOpenGroup: PropTypes.func.isRequired,
};

export default GroupBreadcrumbs;
