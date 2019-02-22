'use strict';

import React        from 'react';
import PropTypes    from 'prop-types';
import { getStore } from '../../services/store-factory';
import { StoreContext } from 'react-use-redux';

const StoreProvider = ({ children }) => (
  <StoreContext.Provider value={getStore()}>
    {children}
  </StoreContext.Provider>
);

StoreProvider.propTypes = {
  children : PropTypes.node
};

export default StoreProvider;
