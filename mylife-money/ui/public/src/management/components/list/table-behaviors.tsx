import React, { useMemo } from 'react';
import { makeStyles, colors } from '@mui/material';
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
          account        : getAccount(state, operation),
          fromChildGroup : (operation.group || null) !== selectedGroup,
          selected       : selectedOperationIds.includes(operation._id)
        }))
      };
    }),
    ...useMemo(() => ({
      onSelect : (val) => dispatch(selectOperation(val)),
      onDetail : (val) => dispatch(showDetail(val))
    }), [dispatch])
  };
};

export const AMOUNT_DEBIT = colors.red[100];
export const AMOUNT_CREDIT = colors.lightGreen[100];
export const AMOUNT_TOTAL = colors.grey[300];
export const FROM_CHILD = colors.grey[200];

export const useStyles = makeStyles(theme => ({
  amountDebit: {
    backgroundColor: colors.red[100]
  },
  amountCredit: {
    backgroundColor: colors.lightGreen[100]
  },
  fromChild: {
    backgroundColor: colors.grey[200]
  },
}));
