'use strict';

import { connect } from 'react-redux';
import { managementSelectGroup } from '../../actions/index';

import Index from '../../components/management/index';

const mapStateToProps = (state) => ({
  selectedGroup : state.management.selectedGroup
});

const mapDispatchToProps = (dispatch) => ({
  onGroupSelected : (value) => dispatch(managementSelectGroup(value)),
});

const IndexContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

export default IndexContainer;
