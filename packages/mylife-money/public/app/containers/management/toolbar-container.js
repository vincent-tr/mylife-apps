'use strict';

import { connect } from 'react-redux';
import { getGroup } from '../../selectors/groups';
import { getSelectedGroupId } from '../../selectors/management';
import { createGroup, updateGroup, deleteGroup } from '../../actions/common';

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
