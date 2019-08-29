'use strict';

import { React, PropTypes, mui, useMemo, useSelector, useDispatch, clsx } from 'mylife-tools-ui';
import { getSelectedGroupId } from '../../../selectors/management';
import { getGroup } from '../../../selectors/reference';
import { selectGroup } from '../../../actions/management';
import icons from '../../icons';
import GroupSelectorButton from '../../common/group-selector-button';

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
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      selectedGroup : getGroup(state, { group: getSelectedGroupId(state) }),
    })),
    ...useMemo(() => ({
      onSelect : (id) => dispatch(selectGroup(id))
    }), [dispatch])
  };
};

const GroupDenseSelector = ({ className, ...props }) => {
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
