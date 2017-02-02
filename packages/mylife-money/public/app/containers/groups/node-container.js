'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren, getSelectedGroupId } from '../../selectors/groups';
import { selectGroup } from '../../actions/index';

import GroupNode from '../../components/groups/node';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state, props) => ({
    selected : getSelectedGroupId(state) === props.group.id,
    children : getSortedChildren(state, props)
  });
};


const mapDispatchToProps = (dispatch, props) => ({
  onSelect : () => dispatch(selectGroup(props.group.id)),
});

const GroupNodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupNode);

export default GroupNodeContainer;
