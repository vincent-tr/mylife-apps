'use strict';

import React from 'react';
import * as views from './views';
import { modules } from 'mylife-tools-ui';
import { createUseConnect } from 'react-use-redux';

const useConnect = createUseConnect(
  (state) => ({
    id: modules.routing.getLocation(state).substr(1) || 'main',
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
