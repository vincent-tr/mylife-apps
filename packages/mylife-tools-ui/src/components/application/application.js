'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import StoreProvider from './store-provider';
import Dialogs from '../../modules/dialogs/components/dialogs';

const Application = ({ dialogs, children }) => (
  <StoreProvider>
    <React.Fragment>
      {dialogs && <Dialogs />}
      {children}
    </React.Fragment>
  </StoreProvider>
);

Application.propTypes = {
  dialogs: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default Application;
