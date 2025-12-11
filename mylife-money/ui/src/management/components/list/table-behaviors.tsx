import * as colors from '@mui/material/colors';
import { useMemo } from 'react';
import { Account, Operation } from '../../../api';
import { getAccount } from '../../../reference/selectors';
import { useAppSelector, useAppDispatch } from '../../../store-api';
import { getSelectedGroupId, getSortedOperations, getSelectedOperationIds, selectOperation, showDetail } from '../../store';

export interface ControlledOperation {
  operation: Operation;
  account: Account;
  fromChildGroup: boolean;
  selected: boolean;
}

export const useConnect = () => {
  const dispatch = useAppDispatch();
  return {
    ...useAppSelector((state) => {
      const selectedGroup = getSelectedGroupId(state) || null;
      const selectedOperationIds = getSelectedOperationIds(state);
      return {
        operations: getSortedOperations(state).map((operation) => ({
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
        onDetail: (operation: string) => dispatch(showDetail(operation)),
      }),
      [dispatch]
    ),
  };
};

export const COLOR_AMOUNT_DEBIT = colors.red[100];
export const COLOR_AMOUNT_CREDIT = colors.lightGreen[100];
export const COLOR_AMOUNT_TOTAL = colors.grey[300];
export const COLOR_FROM_CHILD = colors.grey[200];
