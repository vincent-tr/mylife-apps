'use strict';

import { connect } from 'react-redux';
import { getSelectedGroupId } from '../../selectors/groups';

import Table from '../../components/management/table';

const mapStateToProps = (state) => {
  const selected = getSelectedGroupId(state);
  return {
    operations: state.operations.visible.toArray().map(operation => ({ operation, fromChildGroup: operation.group !== selected }))
  };
};

const TableContainer = connect(
  mapStateToProps,
  null
)(Table);

export default TableContainer;
