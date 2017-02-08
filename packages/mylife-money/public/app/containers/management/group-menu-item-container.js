'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';
import { moveOperations } from '../../actions/management';

import GroupMenuItem from '../../components/management/group-menu-item';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state, props) => ({
    children : getSortedChildren(state, props)
  });
};


const mapDispatchToProps = (dispatch, props) => ({
  onSelect : () => dispatch(moveOperations(props.group.id))
});

const GroupMenuItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupMenuItem);

export default GroupMenuItemContainer;
