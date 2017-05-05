'use strict';

import { connect } from 'react-redux';
import { getGroup } from '../../selectors/groups';

import GroupSelector from '../../components/common/group-selector';

function getStack(state, value) {
  if(!value) {
    return [ getGroup(state, { group: value }) ]; // non tries
  }

  const ret = [];
  while(value) {
    const group = getGroup(state, { group: value });
    ret.push(group);
    value = group.parent;
  }

  ret.reverse();
  return ret;
}

const mapStateToProps = (state, { value }) => ({
  stack: getStack(state, value)
});

// otherwise we will have a dispatch prop in the component
const mapDispatchToProps = (/*dispatch*/) => ({
});

const GroupSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupSelector);

export default GroupSelectorContainer;
