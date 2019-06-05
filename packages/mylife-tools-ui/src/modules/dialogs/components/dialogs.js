'use strict';

import React         from 'react';
import Busy          from './busy';
import Error         from './error';
// import Notifications from './notifications';

const Dialogs = () => (
  <React.Fragment>
    <Busy />
    <Error />
    {/*
      <Notifications />
    */}
  </React.Fragment>
);

export default Dialogs;
