'use strict';

import { React, useMemo, mui, useSelector, useDispatch, AutoSizer } from 'mylife-tools-ui';
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

const Table = (props) => {
  const { onSelect, operations } = useConnect();
  return (
    <div {...props}>
      <AutoSizer disableWidth>
        {({ height }) => (
          <mui.Table height={height}>{/* multiSelectable={true} onRowSelection={(val) => onSelect(rowSelectionPayload(val, operations))}*/}
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
        )}
      </AutoSizer>
    </div>
  );
};

export default Table;
