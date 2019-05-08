'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './treeview.scss';

const TreeNode = ({ containerClassName, arrowClassName, itemClassName, childrenClassName, enabled, active, expanded, onToggle, children, ...props }) => {
  const { item, nodes } = prepareChildren(children);
  return (
    <div className={classNames('tree-node-container', containerClassName)} {...props}>
      <div className={classNames('tree-node-item', itemClassName)}>
        <div
          className={classNames('tree-node-arrow', arrowClassName, { disabled: !enabled, expanded, active })}
          onClick={onToggle} />
        {item}
      </div>
      {expanded && (
        <div className={classNames('tree-node-children', childrenClassName)}>
          {nodes}
        </div>
      )}
    </div>
  );
};

TreeNode.propTypes = {
  containerClassName: PropTypes.string,
  arrowClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  childrenClassName: PropTypes.string,
  enabled: PropTypes.bool,
  active: PropTypes.bool,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

TreeNode.defaultPropTypes = {
  enabled: true,
  active: false,
  expanded: true
};

export default TreeNode;

function prepareChildren(children) {
  const nodes = [];
  const item = [];

  React.Children.forEach(children, child => {
    if(!React.isValidElement(child)) {
      return;
    }

    if(child.type === TreeNode) {
      nodes.push(child);
      return;
    }

    item.push(child);
  });

  return { nodes, item };
}
