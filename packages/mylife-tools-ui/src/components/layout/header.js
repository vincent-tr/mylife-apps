'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ icon, name }) => (
  <div className='header'>
    <div className='icon'>{icon}</div>
    <div className='text'>{name}</div>
  </div>
);

Header.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.node.isRequired,
};

export default Header;