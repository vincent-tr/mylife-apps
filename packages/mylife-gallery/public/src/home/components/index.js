'use strict';

import { React, useMemo, mui, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { homeEnter, homeLeave } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    enter : () => dispatch(homeEnter()),
    leave : () => dispatch(homeLeave()),
  }), [dispatch]);
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Home = () => {
  const classes = useStyles();
  const { enter, leave } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      Home <br/>
      Suggestions: <br/>
       - propose to create album of a root folder if none of the documents inside are in an album <br/>
       - propose to create script (win/*nix) to remove duplicates (for each select the one to keep) <br/>
       - propose to create script to remove other (select with criteria) <br/>
    </div>
  );
};

export default Home;
