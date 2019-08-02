'use strict';

import { React, useMemo, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { homeEnter, homeLeave } from '../../actions/reporting';

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
      <mui.Typography>Total operations count</mui.Typography>
      <mui.Typography>Last import date (= last operation date)</mui.Typography>
    </div>
  );
};

export default Home;
