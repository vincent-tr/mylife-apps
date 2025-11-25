import React from 'react';
import Busy from './busy';
import Error from './error';
import Notifications from './notifications';
import Offline from './offline';

const Dialogs: React.FC = () => (
  <React.Fragment>
    <Offline />
    <Busy />
    <Error />
    <Notifications />
  </React.Fragment>
);

export default Dialogs;
