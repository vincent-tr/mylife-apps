'use strict';

import { connect } from 'react-redux';
import { managementSetMinDate, managementSetMaxDate, managementSetAccount } from '../../actions/index';

import Header from '../../components/management/header';

const mapStateToProps = (state) => ({
  minDate : state.management.minDate,
  maxDate : state.management.maxDate,
  account : state.management.account
});

const mapDispatchToProps = (dispatch) => ({
  onMinDateChanged   : (value) => dispatch(managementSetMinDate(value)),
  onMaxDateChanged   : (value) => dispatch(managementSetMaxDate(value)),
  onAccountChanged   : (value) => dispatch(managementSetAccount(value))
});

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default HeaderContainer;
