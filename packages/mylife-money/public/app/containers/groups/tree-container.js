'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';

import GroupTree from '../../components/groups/tree';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state) => ({
    groups : getSortedChildren(state, {})
  });
};

const GroupTreeContainer = connect(
  mapStateToProps,
  null
)(GroupTree);

export default GroupTreeContainer;
