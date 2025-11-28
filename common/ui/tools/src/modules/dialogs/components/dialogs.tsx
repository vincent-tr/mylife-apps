import React from 'react';
import Busy from './busy';
import Error from './error';
import Notifications from './notifications';
import Offline from './offline';

export default function Dialogs() {
  return (
    <React.Fragment>
      <Offline />
      <Busy />
      <Error />
      <Notifications />
    </React.Fragment>
  );
}
