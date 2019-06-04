'use strict';

import { React, useMemo, mui, useSelector, useDispatch } from 'mylife-tools-ui';
import tabStyles from '../base/tab-styles';
import { getSelectedGroupId, getSortedVisibleOperations, getSelectedOperationIds } from '../../selectors/management';
import { getAccount } from '../../selectors/accounts';
import { selectOperation } from '../../actions/management';

const useConnect = () => {
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

const styles = {
  tableWrapper: {
    height : 'calc(100% - 130px)',
  },
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
};

function rowSelectionPayload(tableSelection, operations) {
  if(tableSelection === 'all') {
    return { all: true, selected: true };
  }
  if(tableSelection === 'none') {
    return { all: true, selected: false };
  }
  return { operations: tableSelection.map(index => operations[index].operation.id) };
}

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

const Table = () => {
  const { onSelect, operations } = useConnect();
  const { totalDebit, totalCredit, total } = summaries(operations);
  return (
    <div style={tabStyles.fullHeight}>
      <mui.Table height={'calc(100% - 57px)'} multiSelectable={true} onRowSelection={(val) => onSelect(rowSelectionPayload(val, operations))}>
        <mui.TableHead>
          <mui.TableRow>
            <mui.TableCell width={150}>Compte</mui.TableCell>
            <mui.TableCell width={100}>Montant</mui.TableCell>
            <mui.TableCell width={100}>Date</mui.TableCell>
            <mui.TableCell>Libellé</mui.TableCell>
            <mui.TableCell>Note</mui.TableCell>
          </mui.TableRow>
        </mui.TableHead>
        <mui.TableBody>
          {operations.map(op => {
            const rowStyle = op.fromChildGroup ? styles.fromChild : styles.normal;
            const amountStyle = op.operation.amount < 0 ? styles.amountDebit : styles.amountCredit;
            return (
              <mui.TableRow key={op.operation.id} style={rowStyle} selected={op.selected}>
                <mui.TableCell width={150}>{op.account && op.account.display}</mui.TableCell>
                <mui.TableCell width={100} style={amountStyle}>{op.operation.amount}</mui.TableCell>
                <mui.TableCell width={100}>{new Date(op.operation.date).toLocaleDateString('fr-FR')}</mui.TableCell>
                <mui.TableCell>{op.operation.label}</mui.TableCell>
                <mui.TableCell>{op.operation.note}</mui.TableCell>
              </mui.TableRow>
            );
          })}
        </mui.TableBody>
      </mui.Table>
      <mui.Toolbar>
        <p>Total</p>
        <p style={Object.assign({}, styles.amountDebit, styles.total)}>{totalDebit}</p>
        <p style={Object.assign({}, styles.amountCredit, styles.total)}>{totalCredit}</p>
        <p style={Object.assign({}, styles.total)}>{total}</p>
      </mui.Toolbar>
    </div>
  );
};

export default Table;
