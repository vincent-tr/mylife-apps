'use strict';

import { connect } from 'react-redux';
import { setMinDate, setMaxDate, setAccount } from '../../actions/management';

import Header from '../../components/management/header';

const mapStateToProps = (state) => ({
  accounts : state.accounts.toArray(),
  minDate  : state.management.minDate,
  maxDate  : state.management.maxDate,
  account  : state.management.account
});

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
