'use strict';

import { useMemo, mui, useSelector, useDispatch } from 'mylife-tools-ui';
import { getSelectedGroupId, getSortedVisibleOperations, getSelectedOperationIds } from '../../selectors/management';
import { getAccount } from '../../selectors/accounts';
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
          selected       : selectedOperationIds.includes(operation.id)
        }))
      };
    }),
    ...useMemo(() => ({
      onSelect : (val) => dispatch(selectOperation(val))
    }), [dispatch])
  };
};

export const useStyles = mui.makeStyles(() => ({
  amountDebit: {
    backgroundColor: mui.colors.red[100]
  },
  amountCredit: {
    backgroundColor: mui.colors.lightGreen[100]
  },
  fromChild: {
    backgroundColor: mui.colors.grey[200]
  },
  normal: {
  },
  total: {
    width: 100
  }
}));
