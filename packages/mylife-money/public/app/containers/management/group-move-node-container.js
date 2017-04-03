'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';

import GroupMoveNode from '../../components/management/group-move-node';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state, props) => ({
    children : getSortedChildren(state, props)
  });
};

const GroupMoveNodeContainer = connect(
  mapStateToProps,
  null
)(GroupMoveNode);

export default GroupMoveNodeContainer;
