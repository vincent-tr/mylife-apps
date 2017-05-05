'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';

import GroupSelectorNode from '../../components/common/group-selector-node';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state, props) => ({
    children : getSortedChildren(state, props)
  });
};

const GroupSelectorNodeContainer = connect(
  mapStateToProps,
  null
)(GroupSelectorNode);

export default GroupSelectorNodeContainer;
