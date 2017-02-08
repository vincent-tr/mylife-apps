'use strict';

import React from 'react';
import * as mui from 'material-ui';
import tabStyles from '../base/tab-styles';
import * as muiColors from 'material-ui/styles/colors';

const styles = {
  tableWrapper: {
    height : 'calc(100% - 130px)',
  },
  amountDebit: {
    backgroundColor: muiColors.red100
  },
  amountCredit: {
    backgroundColor: muiColors.lightGreen100
  },
  fromChild: {
    backgroundColor: muiColors.grey200
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

const Table = ({ onSelect, operations }) => {
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
  return (
    <div style={tabStyles.fullHeight}>
      <mui.Table style={tabStyles.fullHeight} wrapperStyle={styles.tableWrapper} multiSelectable={true} onRowSelection={(val) => onSelect(rowSelectionPayload(val, operations))}>
        <mui.TableHeader>
          <mui.TableRow>
            <mui.TableHeaderColumn>Compte</mui.TableHeaderColumn>
            <mui.TableHeaderColumn>Montant</mui.TableHeaderColumn>
            <mui.TableHeaderColumn>Date</mui.TableHeaderColumn>
            <mui.TableHeaderColumn>Libellé</mui.TableHeaderColumn>
          </mui.TableRow>
        </mui.TableHeader>
        <mui.TableBody>
          {operations.map(op => {
            const rowStyle = op.fromChildGroup ? styles.fromChild : styles.normal;
            const amountStyle = op.operation.amount < 0 ? styles.amountDebit : styles.amountCredit;
            return (
              <mui.TableRow key={op.operation.id} style={rowStyle}>
                <mui.TableRowColumn>{op.operation.account}</mui.TableRowColumn>
                <mui.TableRowColumn style={amountStyle}>{op.operation.amount}</mui.TableRowColumn>
                <mui.TableRowColumn>{op.operation.date}</mui.TableRowColumn>
                <mui.TableRowColumn>{op.operation.label}</mui.TableRowColumn>
              </mui.TableRow>
            );
          })}
        </mui.TableBody>
      </mui.Table>
      <mui.Toolbar>
        <mui.ToolbarGroup>
          <p>Total</p>
          <p style={Object.assign({}, styles.amountDebit, styles.total)}>{totalDebit}</p>
          <p style={Object.assign({}, styles.amountCredit, styles.total)}>{totalCredit}</p>
          <p style={Object.assign({}, styles.total)}>{total}</p>
        </mui.ToolbarGroup>
      </mui.Toolbar>
    </div>
  );
};

Table.propTypes = {
  onSelect   : React.PropTypes.func.isRequired,
  operations : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default Table;
