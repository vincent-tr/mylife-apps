'use strict';

import { React, PropTypes, mui, useSelector } from 'mylife-tools-ui';
import icons from '../icons';
import { getGroup } from '../../reference/selectors';

import GroupSelectorButton from './group-selector-button';

const useConnect = ({ value }) => {
  return useSelector(state => ({
    stack: getStack(state, value)
  }));
};

const useStyles = mui.makeStyles(theme => ({
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
      <mui.Tooltip title='Sélectionner'>
        <GroupSelectorButton onSelect={onChange} className={classes.button}>
          <icons.actions.Move />
        </GroupSelectorButton>
      </mui.Tooltip>
      <mui.Breadcrumbs aria-label='breadcrumb' className={classes.breadcrumbs}>
        {stack.map(node => (
          <mui.Typography key={node._id} color='textPrimary'>{node.display}</mui.Typography>
        ))}
      </mui.Breadcrumbs>
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
