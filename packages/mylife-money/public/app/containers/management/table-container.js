'use strict';

import { connect } from 'react-redux';
import { getSelectedGroupId, getSortedVisibleOperations } from '../../selectors/management';
import { getAccount } from '../../selectors/accounts';
import { selectOperation } from '../../actions/management';

import Table from '../../components/management/table';

const mapStateToProps = (state) => {
  const selected = getSelectedGroupId(state);
  return {
    operations: getSortedVisibleOperations(state).map(operation => ({
      operation,
      account: getAccount(state, operation),
      fromChildGroup: operation.group !== selected
    }))
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
