'use strict';

import React from 'react';
import * as mui from 'material-ui';
import tabStyles from '../base/tab-styles';
import * as muiColors from 'material-ui/styles/colors';

const styles = {
  tableWrapper: {
    height : 'calc(100% - 65px)',
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
  }
};

const Table = ({ operations }) => (
  <mui.Table style={tabStyles.fullHeight} wrapperStyle={styles.tableWrapper} multiSelectable={true}>
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
);

Table.propTypes = {
  operations : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default Table;
