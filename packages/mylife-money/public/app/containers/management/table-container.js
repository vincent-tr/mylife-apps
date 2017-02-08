'use strict';

import { connect } from 'react-redux';
import { getSelectedGroupId, getVisibleOperations } from '../../selectors/management';

import Table from '../../components/management/table';

const mapStateToProps = (state) => {
  const selected = getSelectedGroupId(state);
  return {
    operations: getVisibleOperations(state).map(operation => ({ operation, fromChildGroup: operation.group !== selected }))
  };
};

const TableContainer = connect(
  mapStateToProps,
  null
)(Table);

export default TableContainer;
