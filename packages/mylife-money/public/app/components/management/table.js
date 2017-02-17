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

const Table = ({ onSelect, operations }) => {
  const { totalDebit, totalCredit, total } = summaries(operations);
  return (
    <div style={tabStyles.fullHeight}>
      <mui.Table height={'calc(100% - 57px)'} wrapperStyle={styles.tableWrapper} multiSelectable={true} onRowSelection={(val) => onSelect(rowSelectionPayload(val, operations))}>
        <mui.TableHeader>
          <mui.TableRow>
            <mui.TableHeaderColumn width={150}>Compte</mui.TableHeaderColumn>
            <mui.TableHeaderColumn width={100}>Montant</mui.TableHeaderColumn>
            <mui.TableHeaderColumn width={100}>Date</mui.TableHeaderColumn>
            <mui.TableHeaderColumn>Libellé</mui.TableHeaderColumn>
            <mui.TableHeaderColumn>Note</mui.TableHeaderColumn>
          </mui.TableRow>
        </mui.TableHeader>
        <mui.TableBody deselectOnClickaway={false} key={Math.random().toString()}> {/* FIXME: because selected is not usable without this horror https://github.com/callemall/material-ui/issues/6006 */}
          {operations.map(op => {
            const rowStyle = op.fromChildGroup ? styles.fromChild : styles.normal;
            const amountStyle = op.operation.amount < 0 ? styles.amountDebit : styles.amountCredit;
            return (
              <mui.TableRow key={op.operation.id} style={rowStyle} selected={op.selected}>
                <mui.TableRowColumn width={150}>{op.account && op.account.display}</mui.TableRowColumn>
                <mui.TableRowColumn width={100} style={amountStyle}>{op.operation.amount}</mui.TableRowColumn>
                <mui.TableRowColumn width={100}>{new Date(op.operation.date).toLocaleDateString('fr-FR')}</mui.TableRowColumn>
                <mui.TableRowColumn>{op.operation.label}</mui.TableRowColumn>
                <mui.TableRowColumn>{op.operation.note}</mui.TableRowColumn>
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
