'use strict';

import { connect } from 'react-redux';
import { managementSetMinDate, managementSetMaxDate, managementSetAccount } from '../../actions/index';

import Table from '../../components/management/table';

const mapStateToProps = (state) => ({
  operations: state.operations.toArray()
});

const TableContainer = connect(
  mapStateToProps,
  null
)(Table);

export default TableContainer;
