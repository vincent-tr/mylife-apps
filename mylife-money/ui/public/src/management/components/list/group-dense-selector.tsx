'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { mui, useSelector, useDispatch } from 'mylife-tools-ui';
import icons from '../../../common/icons';
import { getSelectedGroupId } from '../../selectors';
import { getGroup } from '../../../reference/selectors';
import { selectGroup } from '../../actions';
import GroupSelectorButton from '../../../common/components/group-selector-button';

type FIXME_any = any;

const { makeStyles } = mui;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  typography: {
    flex: '1 1 auto',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      selectedGroup : getGroup(state, { group: getSelectedGroupId(state) }),
    })),
    ...useMemo(() => ({
      onSelect : (id) => dispatch(selectGroup(id))
    }), [dispatch])
  };
};

interface GroupDenseSelectorProps {
  className?: string;
}

const GroupDenseSelector = ({ className, ...props }: GroupDenseSelectorProps) => {
  const { selectedGroup, onSelect } = useConnect();
  const classes = useStyles();

  return (
    <div className={clsx(className, classes.container)} {...props}>
      <mui.Tooltip title={'Déplacer l\'opération'}>
        <div>
          <GroupSelectorButton onSelect={onSelect}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </mui.Tooltip>
      <mui.Typography className={classes.typography}>
        {selectedGroup.display}
      </mui.Typography>
    </div>
  );
};

GroupDenseSelector.propTypes = {
  className: PropTypes.string,
};

export default GroupDenseSelector;
