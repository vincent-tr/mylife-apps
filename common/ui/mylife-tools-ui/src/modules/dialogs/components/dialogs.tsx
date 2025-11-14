import React from 'react';
import Offline from './offline';
import Busy from './busy';
import Error from './error';
import Notifications from './notifications';

const Dialogs: React.FC = () => (
  <React.Fragment>
    <Offline />
    <Busy />
    <Error />
    <Notifications />
  </React.Fragment>
);

export default Dialogs;
