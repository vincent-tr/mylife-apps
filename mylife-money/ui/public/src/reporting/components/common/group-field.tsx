'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import icons from '../../../common/icons';

import GroupSelector from '../../../common/components/group-selector';
import { makeStyles, Typography, Tooltip, IconButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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
        <Typography className={classes.label}>Groupes</Typography>
        <Tooltip title='Ajouter un groupe'>
          <IconButton onClick={() => onGroupAdd()} className={classes.addButton}>
            <icons.actions.New />
          </IconButton>
        </Tooltip>
      </div>
      {groups.map((group, index) => (
        <div key={index} className={classes.item}>
          <GroupSelector value={group} onChange={(value) => onGroupChanged(index, value)} />
          <Tooltip title='Supprimer le groupe'>
            <IconButton onClick={() => onGroupDelete(index)}>
              <icons.actions.Delete />
            </IconButton>
          </Tooltip>
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
