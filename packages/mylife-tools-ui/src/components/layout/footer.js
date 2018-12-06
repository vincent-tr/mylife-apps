'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ children }) => (
  <div className={'layout-footer'}>
    {children}
  </div>
);

Footer.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default Footer;