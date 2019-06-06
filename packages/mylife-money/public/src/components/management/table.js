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

  const columns = [
    { dataKey: 'account', width: 150, headerRenderer: 'Compte', cellDataGetter: ({ rowData }) => rowData.account && rowData.account.display },
    { dataKey: 'amount', width: 100, headerRenderer: 'Montant', cellDataGetter: ({ rowData }) => rowData.operation.amount, cellClassName: value => value < 0 ? classes.amountDebit : classes.amountCredit },
    { dataKey: 'date', width: 100, headerRenderer: 'Date', cellDataGetter: ({ rowData }) => new Date(rowData.operation.date).toLocaleDateString('fr-FR') }, // TODO: formatter
    { dataKey: 'label', headerRenderer: 'Libellé', cellDataGetter: ({ rowData }) => rowData.operation.label },
    { dataKey: 'note', headerRenderer: 'Note', cellDataGetter: ({ rowData }) => rowData.operation.note }
  ];

  // multiSelectable={true} onRowSelection={(val) => onSelect(rowSelectionPayload(val, operations))}

  /*
  return (
    <div {...props}>
      <AutoSizer disableWidth>
        {({ height }) => (
          <mui.Table height={height}>
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
  */

  return (
    <VirtualizedTable data={operations} columns={columns} {...props} rowClassName={rowClassName} />
  );
};

export default Table;
