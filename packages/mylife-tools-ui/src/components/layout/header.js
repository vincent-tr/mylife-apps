'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ appName, appIcon, viewIcon, viewName }) => (
  <div className='header'>
    <div className='app'>
      <div className='icon'>{appIcon}</div>
      <div className='text'>{appName}</div>
    </div>
    <div className='view'>
      <div className='icon'>{viewIcon}</div>
      <div className='text'>{viewName}</div>
    </div>
  </div>
);

Header.propTypes = {
  appIcon: PropTypes.node.isRequired,
  appName: PropTypes.node.isRequired,
  viewIcon: PropTypes.node.isRequired,
  viewName: PropTypes.node.isRequired,
};


export default Header;