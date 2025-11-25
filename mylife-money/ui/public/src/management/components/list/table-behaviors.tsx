import { useMemo } from 'react';
import * as colors from '@mui/material/colors';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedGroupId, getSortedOperations, getSelectedOperationIds, selectOperation, showDetail } from '../../store';
import { getAccount } from '../../../reference/selectors';

type FIXME_any = any;

export const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector((state: FIXME_any) => {
      const selectedGroup = getSelectedGroupId(state) || null;
      const selectedOperationIds = getSelectedOperationIds(state);
      return {
        operations: getSortedOperations(state).map((operation: FIXME_any) => ({
          operation,
          account: getAccount(state, operation.account),
          fromChildGroup: (operation.group || null) !== selectedGroup,
          selected: selectedOperationIds.includes(operation._id),
        })),
      };
    }),
    ...useMemo(
      () => ({
        onSelect: (val) => dispatch(selectOperation(val)),
        onDetail: (val) => dispatch(showDetail(val)),
      }),
      [dispatch]
    ),
  };
};

export const COLOR_AMOUNT_DEBIT = colors.red[100];
export const COLOR_AMOUNT_CREDIT = colors.lightGreen[100];
export const COLOR_AMOUNT_TOTAL = colors.grey[300];
export const COLOR_FROM_CHILD = colors.grey[200];
