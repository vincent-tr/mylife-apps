'use strict';

import { connect } from 'react-redux';
import { makeGetSortedChildren } from '../../selectors/groups';
import { getSelectedGroupId } from '../../selectors/management';

import GroupMenuItem from '../../components/management/group-menu-item';

const mapStateToProps = () => {
  const getSortedChildren = makeGetSortedChildren();
  return (state, props) => ({
    children : getSortedChildren(state, props)
  });
};


const mapDispatchToProps = (dispatch, props) => ({
  onSelect : () => { console.log('onSelect', props); }, // TODO
});

const GroupMenuItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupMenuItem);

export default GroupMenuItemContainer;
