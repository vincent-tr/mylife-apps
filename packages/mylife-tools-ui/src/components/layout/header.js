'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ appName, appIcon, viewIcon, viewName }) => (
  <div className='layout-header'>
    {appIcon}
    {appName}
    {viewIcon}
    {viewName}
  </div>
);

Header.propTypes = {
  appIcon: PropTypes.node.isRequired,
  appName: PropTypes.node.isRequired,
  viewIcon: PropTypes.node.isRequired,
  viewName: PropTypes.node.isRequired,
};


export default Header;