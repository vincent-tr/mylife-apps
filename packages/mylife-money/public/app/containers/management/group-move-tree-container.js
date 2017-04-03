'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';

import GroupMoveTree from '../../components/management/group-move-tree';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state) => ({
    groups : getSortedChildren(state, {})
  });
};

const GroupMoveTreeContainer = connect(
  mapStateToProps,
  null
)(GroupMoveTree);

export default GroupMoveTreeContainer;
