'use strict';

import React from 'react';
import * as views from './views';
import { getView } from '../selectors/view';
import { createUseConnect } from 'react-use-redux';

const useConnect = createUseConnect(
  (state) => ({
    id: getView(state),
  })
);

const Dispatcher = () => {
  const { id } = useConnect();
  const View = views[id];
  return (
    <View />
  );
};

export default Dispatcher;
