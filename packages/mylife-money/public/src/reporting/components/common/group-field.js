'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../../components/icons';

import GroupSelector from '../../../components/common/group-selector';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    marginRight: theme.spacing(1)
  },
  addButton: {
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

const GroupField = ({ groups, onGroupAdd, onGroupChanged, onGroupDelete }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <mui.Typography className={classes.label}>Groupes</mui.Typography>
        <mui.Tooltip title='Ajouter un groupe'>
          <mui.IconButton onClick={() => onGroupAdd()} className={classes.addButton}>
            <icons.actions.New />
          </mui.IconButton>
        </mui.Tooltip>
      </div>
      {groups.map((group, index) => (
        <div key={index} className={classes.item}>
          <GroupSelector value={group} onChange={(value) => onGroupChanged(index, value)} />
          <mui.Tooltip title='Supprimer le groupe'>
            <mui.IconButton onClick={() => onGroupDelete(index)}>
              <icons.actions.Delete />
            </mui.IconButton>
          </mui.Tooltip>
        </div>
      ))}
    </div>
  );
};

GroupField.propTypes = {
  groups: PropTypes.object.isRequired,
  onGroupAdd: PropTypes.func.isRequired,
  onGroupChanged: PropTypes.func.isRequired,
  onGroupDelete: PropTypes.func.isRequired
};

export default GroupField;
