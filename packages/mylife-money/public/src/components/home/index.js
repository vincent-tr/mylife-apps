'use strict';

import { React, useMemo, mui, useDispatch, dialogs } from 'mylife-tools-ui';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    busySet : (value) => dispatch(dialogs.busySet(value)),
    notificationShow : (type) => dispatch(dialogs.notificationShow({ message: 'message ' + type, type : dialogs.notificationShow.types[type] })),
  }), [dispatch]);
};

const Home = () => {
  const { busySet, notificationShow } = useConnect();

  const onBusy = () => {
    busySet(true);
    setTimeout(() => busySet(false), 3000);
  };

  const onError = () => {
    busySet(new Error('error toto'));
  };

  return (
    <div>
      <mui.Button onClick={onBusy}>Busy</mui.Button>
      <mui.Button onClick={onError}>Error</mui.Button>
      <mui.Button onClick={() => notificationShow('success')}>Notification Success</mui.Button>
      <mui.Button onClick={() => notificationShow('info')}>Notification Info</mui.Button>
      <mui.Button onClick={() => notificationShow('warning')}>Notification Warning</mui.Button>
      <mui.Button onClick={() => notificationShow('error')}>Notification Error</mui.Button>
      <mui.Button>Custom dialog</mui.Button>
      <mui.Typography>TODO</mui.Typography>
      <mui.Typography>Graph with total operations count / +sum / -sum / balance per month for current year and past year</mui.Typography>
      <mui.Typography>Total operations count</mui.Typography>
      <mui.Typography>Last import date (= last operation date)</mui.Typography>
    </div>
  );
};

export default Home;
