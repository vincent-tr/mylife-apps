'use strict';

import { connect } from 'react-redux';
import { getSelectedGroupId, getGroup } from '../../selectors/groups';
import { createGroup, updateGroup, deleteGroup } from '../../actions/index';

import Toolbar from '../../components/management/toolbar';

const mapStateToProps = (state) => {
  const selected = getSelectedGroupId(state);
  return {
    group     : selected && getGroup(state, { group: selected }),
    canChange : !!selected
  };
};

const mapDispatchToProps = (dispatch) => ({
  onGroupCreate   : () => dispatch(createGroup()),
  onGroupEdit     : (group) => dispatch(updateGroup(group)),
  onGroupDelete   : () => dispatch(deleteGroup())
});

const ToolbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);

export default ToolbarContainer;
