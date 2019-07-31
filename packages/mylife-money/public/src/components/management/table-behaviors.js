'use strict';

import { useMemo, mui, useSelector, useDispatch } from 'mylife-tools-ui';
import { getSelectedGroupId, getSortedVisibleOperations, getSelectedOperationIds } from '../../selectors/management';
import { getAccount } from '../../selectors/reference';
import { selectOperation } from '../../actions/management';

export const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => {
      const selectedGroup = getSelectedGroupId(state) || null;
      const selectedOperationIds = getSelectedOperationIds(state);
      return {
        operations: getSortedVisibleOperations(state).map(operation => ({
          operation,
          account        : getAccount(state, operation),
          fromChildGroup : (operation.group || null) !== selectedGroup,
          selected       : selectedOperationIds.includes(operation._id)
        }))
      };
    }),
    ...useMemo(() => ({
      onSelect : (val) => dispatch(selectOperation(val))
    }), [dispatch])
  };
};

export const useStyles = mui.makeStyles(theme => ({
  amountDebit: {
    backgroundColor: mui.colors.red[100]
  },
  amountCredit: {
    backgroundColor: mui.colors.lightGreen[100]
  },
  amountTotal: {
    backgroundColor: mui.colors.grey[300]
  },
  fromChild: {
    backgroundColor: mui.colors.grey[200]
  },
  normal: {
  },
  total: {
    width: 100,
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  }
}));
