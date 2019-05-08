'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TreeNode from './tree-node';

import './treeview.scss';

const Node = ({ item, itemParser, value, onSelect }) => {
  const [expanded, setExpanded] = useState(true);
  const onToggle = () => setExpanded(!expanded);

  const { id, text, items } = itemParser(item);
  const active = Object.is(value, id);
  const onClick = onSelect && (() => onSelect(id));
  return (
    <TreeNode active={active} expanded={expanded} onToggle={onToggle}>
      <div onClick={onClick} className='tree-node-text'>
        {text}
      </div>
      {items.map(item => (
        <Node key={itemParser(item).id} item={item} itemParser={itemParser} value={value} onSelect={onSelect} />
      ))}
    </TreeNode>
  );
};

Node.propTypes = {
  item: PropTypes.object.isRequired,
  itemParser: PropTypes.func.isRequired,
  value: PropTypes.any,
  onSelect: PropTypes.func
};

// Use TreeNode directly if more flexibility is needed
const TreeView = ({ items, itemParser, value, onSelect, ...props }) => {
  return (
    <div className='tree-view' {...props}>
      {items.map(item => (
        <Node key={itemParser(item).id} item={item} itemParser={itemParser} value={value} onSelect={onSelect} />
      ))}
    </div>
  );
};

TreeView.propTypes = {
  items: PropTypes.array,
  itemParser: PropTypes.func,
  value: PropTypes.any,
  onSelect: PropTypes.func
};

TreeView.defaultProps = {
  items: [],
  itemParser: ({ id, text, items }) => ({ id, text, items }),
};

export default TreeView;
