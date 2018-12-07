'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Menu = ({ items }) => (
  <ul className='menu'>
    {items.map(({ id, text, icon, onClick, type }) => (
      <li key={id} onClick={() => onClick(id)} className={classNames(type, { clickable: onClick })}>
        {icon && <div className='icon'>{icon}</div>}
        <div className='text'>{text}</div>
      </li>
    ))}
  </ul>
);

Menu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id      : PropTypes.string.isRequired,
      text    : PropTypes.node.isRequired,
      icon    : PropTypes.node,
      onClick : PropTypes.func,
      type    : PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

export default Menu;