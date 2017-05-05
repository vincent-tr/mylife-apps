'use strict';

import { connect } from 'react-redux';
import { getAccounts } from '../../selectors/accounts';

import AccountSelector from '../../components/common/account-selector';

const mapStateToProps = (state) => ({
  accounts : getAccounts(state),
});

// otherwise we will have a dispatch prop in the component
const mapDispatchToProps = (/*dispatch*/) => ({
});

const AccountSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountSelector);

export default AccountSelectorContainer;
