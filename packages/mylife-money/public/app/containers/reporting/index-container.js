'use strict';

import { connect } from 'react-redux';
import { getOperations } from '../../selectors/reporting';
import { getGroups, makeGetGroupBags, makeGetGroupStacks } from '../../selectors/groups';
import { refreshOperations, resetOperations } from '../../actions/reporting';

import Index from '../../components/reporting/index';

const mapStateToProps = () => {
  const getGroupBags   = makeGetGroupBags();
  const getGroupStacks = makeGetGroupStacks();

  return (state) => ({
    operations  : getOperations(state),
    groups      : getGroups(state),
    groupBags   : getGroupBags(state),
    groupStacks : getGroupStacks(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  onRefreshOperations : (minDate, maxDate, account) => dispatch(refreshOperations(minDate, maxDate, account)),
  onResetOperations   : () => dispatch(resetOperations())
});

const IndexContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

export default IndexContainer;
