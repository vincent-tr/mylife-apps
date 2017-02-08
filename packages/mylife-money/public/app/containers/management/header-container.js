'use strict';

import { connect } from 'react-redux';
import { setMinDate, setMaxDate, setAccount } from '../../actions/management';
import { getSelectedOperations } from '../../selectors/management';
import { getAccounts } from '../../selectors/accounts';
import { makeGetSortedChildren } from '../../selectors/groups';

import Header from '../../components/management/header';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state, props) => ({
    canMove    : !!getSelectedOperations(state).length,
    accounts   : getAccounts(state),
    rootGroups : getSortedChildren(state, {}),
    minDate    : state.management.minDate,
    maxDate    : state.management.maxDate,
    account    : state.management.account
  });
};

const mapDispatchToProps = (dispatch) => ({
  onMinDateChanged   : (value) => dispatch(setMinDate(value)),
  onMaxDateChanged   : (value) => dispatch(setMaxDate(value)),
  onAccountChanged   : (value) => dispatch(setAccount(value))
});

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default HeaderContainer;
