'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';

import GroupNode from '../../components/groups/node';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state, props) => ({
    children : getSortedChildren(state, props)
  });
};

const GroupNodeContainer = connect(
  mapStateToProps,
  null
)(GroupNode);

export default GroupNodeContainer;
