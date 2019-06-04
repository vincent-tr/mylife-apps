'use strict';

import { React, mui, useSelector } from 'mylife-tools-ui';
import { getSelectedGroupId, getSortedVisibleOperations, getSelectedOperationIds } from '../../selectors/management';
import { getAccount } from '../../selectors/accounts';

// TODO: copy/paste of table
const useConnect = () => {
  return useSelector(state => {
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
  });
};

const styles = {
  amountDebit: {
    backgroundColor: mui.colors.red[100]
  },
  amountCredit: {
    backgroundColor: mui.colors.lightGreen[100]
  },
  total: {
    width: 100
  }
};

function summaries(operations) {
  let totalDebit = 0;
  let totalCredit = 0;
  let total = 0;
  for(const op of operations) {
    const amount = op.operation.amount;
    amount < 0 ? (totalDebit += -amount) : (totalCredit += amount);
    total += amount;
  }
  totalDebit = Math.round(totalDebit * 100) / 100;
  totalCredit = Math.round(totalCredit * 100) / 100;
  total = Math.round(total * 100) / 100;

  return {
    totalDebit, totalCredit, total
  };
}

const Table = (props) => {
  const { operations } = useConnect();
  const { totalDebit, totalCredit, total } = summaries(operations);
  return (
    <mui.Toolbar {...props}>
      <p>Total</p>
      <p style={Object.assign({}, styles.amountDebit, styles.total)}>{totalDebit}</p>
      <p style={Object.assign({}, styles.amountCredit, styles.total)}>{totalCredit}</p>
      <p style={Object.assign({}, styles.total)}>{total}</p>
    </mui.Toolbar>
  );
};

export default Table;
