'use strict';

import { connect } from 'react-redux';
import { getOperations} from '../../selectors/reporting';
import { refreshOperations, resetOperations } from '../../actions/reporting';

import Index from '../../components/reporting/index';

const mapStateToProps = (state) => ({
  operations: getOperations(state)
});


const mapDispatchToProps = (dispatch) => ({
  onRefreshOperations : (minDate, maxDate, account) => dispatch(refreshOperations(minDate, maxDate, account)),
  onResetOperations   : () => dispatch(resetOperations())
});

const IndexContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

export default IndexContainer;
