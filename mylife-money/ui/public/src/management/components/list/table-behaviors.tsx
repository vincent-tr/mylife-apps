'use strict';

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mui } from 'mylife-tools-ui';
import { getSelectedGroupId, getSortedOperations, getSelectedOperationIds } from '../../selectors';
import { getAccount } from '../../../reference/selectors';
import { selectOperation, showDetail } from '../../actions';

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
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  totalNormal: {
    width: 100,
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  totalDense: {
    width: 80,
    marginLeft: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  totalOpsNormal: {
    marginLeft: theme.spacing(2),
  },
  totalOpsDense: {
    marginLeft: theme.spacing(1),
  }
}));
