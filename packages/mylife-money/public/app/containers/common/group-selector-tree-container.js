'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';

import GroupSelectorTree from '../../components/common/group-selector-tree';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state) => ({
    groups : getSortedChildren(state, {})
  });
};

const GroupSelectorTreeContainer = connect(
  mapStateToProps,
  null
)(GroupSelectorTree);

export default GroupSelectorTreeContainer;
