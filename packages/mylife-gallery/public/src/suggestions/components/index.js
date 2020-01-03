'use strict';

import { React, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getView } from '../selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      suggestions : getView(state),
    })),
    ...useMemo(() => ({
      enter : () => dispatch(enter()),
      leave : () => dispatch(leave()),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Suggestions = () => {
  const classes = useStyles();
  const { enter, leave, suggestions } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      Suggestions <br/>
      {JSON.stringify(suggestions)}
    </div>
  );
};

export default Suggestions;
