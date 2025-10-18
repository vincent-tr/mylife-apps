'use strict';

import React        from 'react';
import PropTypes    from 'prop-types';
import { Provider } from 'react-redux';
import { getStore } from '../../services/store-factory';

const StoreProvider = ({ children }) => (
  <Provider store={getStore()}>
    {children}
  </Provider>
);

StoreProvider.propTypes = {
  children : PropTypes.node
};

export default StoreProvider;
