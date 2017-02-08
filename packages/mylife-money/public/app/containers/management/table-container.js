'use strict';

import { connect } from 'react-redux';
import { getSelectedGroupId, getSortedVisibleOperations, getSelectedOperationIds } from '../../selectors/management';
import { getAccount } from '../../selectors/accounts';
import { selectOperation } from '../../actions/management';

import Table from '../../components/management/table';

const mapStateToProps = (state) => {
  const selectedGroup = getSelectedGroupId(state);
  const selectedOperationIds = getSelectedOperationIds(state);
  return {
    operations: getSortedVisibleOperations(state).map(operation => ({
      operation,
      account        : getAccount(state, operation),
      fromChildGroup : operation.group !== selectedGroup,
      selected       : selectedOperationIds.includes(operation.id)
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
