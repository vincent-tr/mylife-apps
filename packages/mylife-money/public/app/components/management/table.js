'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';
import base from '../base/index';
import tabStyles from '../base/tab-styles';

const styles = {
  tableWrapper: {
    height : 'calc(100% - 65px)',
  }
};

const Table = ({ operations }) => (
  <mui.Table style={tabStyles.fullHeight} wrapperStyle={styles.tableWrapper}>
    <mui.TableHeader>
      <mui.TableRow>
        <mui.TableHeaderColumn>Compte</mui.TableHeaderColumn>
        <mui.TableHeaderColumn>Montant</mui.TableHeaderColumn>
        <mui.TableHeaderColumn>Date</mui.TableHeaderColumn>
        <mui.TableHeaderColumn>Libellé</mui.TableHeaderColumn>
      </mui.TableRow>
    </mui.TableHeader>
    <mui.TableBody>
      {operations.map(op => (
        <mui.TableRow key={op.id}>
          <mui.TableRowColumn>{op.account}</mui.TableRowColumn>
          <mui.TableRowColumn>{op.amount}</mui.TableRowColumn>
          <mui.TableRowColumn>{op.date}</mui.TableRowColumn>
          <mui.TableRowColumn>{op.label}</mui.TableRowColumn>
        </mui.TableRow>
      ))}
    </mui.TableBody>
  </mui.Table>
);

Table.propTypes = {
  operations : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired
};

export default Table;
