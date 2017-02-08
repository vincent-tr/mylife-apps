'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';
import { getSelectedGroupId } from '../../selectors/management';
import { selectGroup } from '../../actions/index';

import GroupNode from '../../components/management/group-node';

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
