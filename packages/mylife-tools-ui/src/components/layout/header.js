'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ appName, appIcon, viewIcon, viewName }) => (
    {appIcon}
    {appName}
    {viewIcon}
    {viewName}
  <div className='header'>
  </div>
);

Header.propTypes = {
  appIcon: PropTypes.node.isRequired,
  appName: PropTypes.node.isRequired,
  viewIcon: PropTypes.node.isRequired,
  viewName: PropTypes.node.isRequired,
};


export default Header;