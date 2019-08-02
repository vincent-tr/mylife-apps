'use strict';

import { React, useMemo, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { homeEnter, homeLeave } from '../../actions/reporting';
import OperationStats from './operation-stats';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    enter : () => dispatch(homeEnter()),
    leave : () => dispatch(homeLeave()),
  }), [dispatch]);
};

const Home = () => {
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div>
      <mui.Typography>TODO</mui.Typography>
      <mui.Typography>Graph with total operations count / +sum / -sum / balance per month for current year and past year</mui.Typography>
      <OperationStats />
    </div>
  );
};

export default Home;
