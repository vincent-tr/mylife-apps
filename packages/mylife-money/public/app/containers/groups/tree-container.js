'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';

import Tree from '../../components/groups/tree';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state) => ({
    groups : getSortedChildren(state, {})
  });
};

const TreeContainer = connect(
  mapStateToProps,
  null
)(Tree);

export default TreeContainer;
