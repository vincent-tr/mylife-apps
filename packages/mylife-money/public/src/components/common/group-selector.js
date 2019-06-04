'use strict';

import { React, PropTypes, useSelector } from 'mylife-tools-ui';
import icons from '../icons';
import { getGroup } from '../../selectors/groups';

import GroupSelectorButton from './group-selector-button';

const useConnect = ({ value }) => {
  return useSelector(state => ({
    stack: getStack(state, value)
  }));
};

const styles = {
  button: {
    height   : 56,
    width    : 56,
    overflow : 'inherit',
  },
  mainWrapper: {
    display  : 'inline-block',
    height   : 56,
  },
  nodeListContainer: {
    display  : 'inline-block',
    height   : 32,
    padding  : 12
  },
  nodeContainer: {
    display         : 'inline-block',
    backgroundColor : 'rgba(0, 0, 0, 0.2)',
    borderRadius    : 10,
    padding         : '0px 10px',
    margin          : '0px 2px',
  },
  node: {
    margin: 6
  }
};

const GroupSelector = ({ onChange, value, ...props }) => {
  const { stack } = useConnect({ value });
  return (
    <div style={styles.mainWrapper} {...props}>
      <GroupSelectorButton onSelect={onChange}
                           style={styles.button}
                           tooltip="Sélectionner">
        <icons.actions.Move />
      </GroupSelectorButton>
      <div style={styles.nodeListContainer}>
        {stack.map(node => (
          <div style={styles.nodeContainer} key={node.id}>
            <p style={styles.node}>
              {node.display}
            </p>
          </div>
        ))}
      </div>
    </div>

  );
};

GroupSelector.propTypes = {
  value     : PropTypes.string,
  onChange  : PropTypes.func.isRequired,
};

export default GroupSelector;


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
