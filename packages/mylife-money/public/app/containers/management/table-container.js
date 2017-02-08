'use strict';

import { connect } from 'react-redux';
import { getSelectedGroupId, getVisibleOperations } from '../../selectors/management';
import { selectOperation } from '../../actions/management';

import Table from '../../components/management/table';

const mapStateToProps = (state) => {
  const selected = getSelectedGroupId(state);
  return {
    operations: getVisibleOperations(state).map(operation => ({ operation, fromChildGroup: operation.group !== selected }))
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSelect : (val) => dispatch(selectOperation(val)),
});

const TableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Table);

export default TableContainer;
