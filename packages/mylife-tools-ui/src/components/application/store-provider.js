'use strict';

import React        from 'react';
import PropTypes    from 'prop-types';
import { getStore } from '../../services/store-factory';
import { Provider } from 'react-redux';
import { StoreContext } from 'react-use-redux';

const StoreProvider = ({ children }) => (
  <Provider store={getStore()}>
    <StoreContext.Provider value={getStore()}>
      {children}
    </StoreContext.Provider>
  </Provider>
);

StoreProvider.propTypes = {
  children : PropTypes.node
};

export default StoreProvider;
