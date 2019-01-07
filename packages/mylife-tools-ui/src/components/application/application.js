'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import StoreProvider from './store-provider';

const Application = ({ children }) => (
  <StoreProvider>
    <React.Fragment>
      {children}
    </React.Fragment>
  </StoreProvider>
);

Application.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default Application;
