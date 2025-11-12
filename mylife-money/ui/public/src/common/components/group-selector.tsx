import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import icons from '../icons';
import { getGroup } from '../../reference/selectors';

import GroupSelectorButton from './group-selector-button';
import { makeStyles, Tooltip, Breadcrumbs, Typography } from '@mui/material';

const useConnect = ({ value }) => {
  return useSelector(state => ({
    stack: getStack(state, value)
  }));
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
  },
  breadcrumbs: {
    flex: '1 1 auto',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  }
}));

const GroupSelector = ({ onChange, value, ...props }) => {
  const classes = useStyles();
  const { stack } = useConnect({ value });
  return (
    <div className={classes.container} {...props}>
      <Tooltip title='Sélectionner'>
        <GroupSelectorButton onSelect={onChange} className={classes.button}>
          <icons.actions.Move />
        </GroupSelectorButton>
      </Tooltip>
      <Breadcrumbs aria-label='breadcrumb' className={classes.breadcrumbs}>
        {stack.map(node => (
          <Typography key={node._id} color='textPrimary'>{node.display}</Typography>
        ))}
      </Breadcrumbs>
    </div>
  );
};

GroupSelector.propTypes = {
  value     : PropTypes.string,
  onChange  : PropTypes.func.isRequired,
};

export default GroupSelector;


function getStack(state, value) {
  if(!value) {
    const group = getGroup(state, { group: value });
    if(!group) {
      return []; // not loaded
    }
    return [ group ]; // non tries
  }

  const ret = [];
  while(value) {
    const group = getGroup(state, { group: value });
    ret.push(group);
    value = group.parent;
  }

  ret.reverse();
  return ret;
}
