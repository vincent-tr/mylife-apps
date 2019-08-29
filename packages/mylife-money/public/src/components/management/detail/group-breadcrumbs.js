'use strict';

import { React, mui, PropTypes } from 'mylife-tools-ui';
import icons from '../../icons';
import GroupSelectorButton from '../../common/group-selector-button';

const { makeStyles } = mui;

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
      <mui.Tooltip title={'Déplacer l\'opération'}>
        <div>
          <GroupSelectorButton onSelect={onMove}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </mui.Tooltip>

      <mui.Breadcrumbs aria-label='breadcrumb' className={classes.breadcrumbs}>
        {groupStack.map(group => {
          const handleClick = e => {
            e.preventDefault();
            onOpenGroup(group._id);
          };

          return (
            <mui.Link key={group._id} color='textPrimary' href='#' onClick={handleClick}>
              {group.display}
            </mui.Link>
          );
        })}
      </mui.Breadcrumbs>
    </div>
  );
};

GroupBreadcrumbs.propTypes = {
  groupStack: PropTypes.array,
  onMove: PropTypes.func.isRequired,
  onOpenGroup: PropTypes.func.isRequired,
};

export default GroupBreadcrumbs;
