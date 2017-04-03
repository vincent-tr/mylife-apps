'use strict';

import React from 'react';
import store from '../../services/store-factory';
import { Provider } from 'react-redux';

const StoreProvider = (props) => (
  <Provider store={store}>
    { props.children }
  </Provider>
);

StoreProvider.propTypes = {
  children: React.PropTypes.node
};

export default StoreProvider;
