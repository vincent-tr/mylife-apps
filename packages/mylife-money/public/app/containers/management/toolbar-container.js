'use strict';

import { connect } from 'react-redux';
import { getSelectedGroupId } from '../../selectors/groups';
import { createGroup, deleteGroup } from '../../actions/index';

import Toolbar from '../../components/management/toolbar';

const mapStateToProps = (state) => ({
  canChange : !!getSelectedGroupId(state)
});

const mapDispatchToProps = (dispatch) => ({
  onGroupCreate   : () => dispatch(createGroup()),
  onGroupEdit     : () => {},
  onGroupDelete   : (id) => dispatch(deleteGroup(id))
});

const ToolbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);

export default ToolbarContainer;
