'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import StoreProvider from './store-provider';

const Application = ({ dialogs, children }) => (
  <StoreProvider>
    <React.Fragment>
      {dialogs && false /* TODO */}
      {children}
    </React.Fragment>
  </StoreProvider>
);

Application.propTypes = {
  dialogs: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default Application;
