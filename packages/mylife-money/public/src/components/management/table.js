'use strict';

import { React, mui, VirtualizedTable } from 'mylife-tools-ui';
import { useConnect, useStyles } from './table-behaviors';

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
  const classes = useStyles();
  const rowClassName = (row) => row && row.fromChildGroup ? classes.fromChild : classes.normal; // row undefined => header

  const selectedCount = operations.reduce(((acc, op) => op.selected ? acc + 1 : acc), 0);

  const headerCheckbox = (
    <mui.Checkbox
      color='primary'
      indeterminate={selectedCount > 0 && selectedCount < operations.length}
      checked={selectedCount === operations.length}
      onChange={e => onSelect({ selected: e.target.checked })}/>
  );

  const cellCheckbox = (row) => (
    <mui.Checkbox color='primary' checked={row.selected} onChange={e => onSelect({ id: row.operation.id, selected: e.target.checked })}/>
  );

  const columns = [
    { dataKey: 'checkbox', width: 80, headerRenderer: headerCheckbox, cellDataGetter: ({ rowData }) => rowData, cellRenderer: cellCheckbox },
    { dataKey: 'account', width: 150, headerRenderer: 'Compte', cellDataGetter: ({ rowData }) => rowData.account && rowData.account.display },
    { dataKey: 'amount', width: 100, headerRenderer: 'Montant', cellDataGetter: ({ rowData }) => rowData.operation.amount, cellClassName: value => value < 0 ? classes.amountDebit : classes.amountCredit },
    { dataKey: 'date', width: 100, headerRenderer: 'Date', cellDataGetter: ({ rowData }) => new Date(rowData.operation.date).toLocaleDateString('fr-FR') }, // TODO: formatter
    { dataKey: 'label', headerRenderer: 'Libellé', cellDataGetter: ({ rowData }) => rowData.operation.label },
    { dataKey: 'note', headerRenderer: 'Note', cellDataGetter: ({ rowData }) => rowData.operation.note }
  ];

  // multiSelectable={true} onRowSelection={(val) => onSelect(rowSelectionPayload(val, operations))}

  return (
    <VirtualizedTable data={operations} columns={columns} {...props} rowClassName={rowClassName} />
  );
};

export default Table;
