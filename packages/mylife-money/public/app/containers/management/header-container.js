'use strict';

import { connect } from 'react-redux';
import { setMinDate, setMaxDate, setAccount, importOperations, operationsExecuteRules, operationsSetNote, moveOperations } from '../../actions/management';
import { getSelectedOperations, getSelectedGroupId } from '../../selectors/management';
import { getAccounts } from '../../selectors/accounts';
import { makeGetSortedChildren } from '../../selectors/groups';

import Header from '../../components/management/header';

const mapStateToProps = (state) => {
  const selectedOperations = getSelectedOperations(state);
  return {
    showExecuteRules     : !getSelectedGroupId(state),
    canProcessOperations : !!selectedOperations.length,
    accounts             : getAccounts(state),
    minDate              : state.management.minDate,
    maxDate              : state.management.maxDate,
    account              : state.management.account,
    noteText             : selectedOperations.length === 1 ? selectedOperations[0].note : ''
  };
};

const mapDispatchToProps = (dispatch) => ({
  onMinDateChanged         : (value) => dispatch(setMinDate(value)),
  onMaxDateChanged         : (value) => dispatch(setMaxDate(value)),
  onAccountChanged         : (value) => dispatch(setAccount(value)),
  onOperationsImport       : (account, file) => dispatch(importOperations(account, file)),
  onOperationsExecuteRules : () => dispatch(operationsExecuteRules()),
  onOperationsSetNote      : (note) => dispatch(operationsSetNote(note)),
  onOperationsMove         : (group) => dispatch(moveOperations(group))
});

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default HeaderContainer;
