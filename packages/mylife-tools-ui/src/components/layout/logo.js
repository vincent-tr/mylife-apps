'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ name, icon }) => (
  <div className='logo'>
    <div className='icon'>{icon}</div>
    <div className='text'>{name}</div>
  </div>
);

Logo.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.node.isRequired,
};


export default Logo;