'use strict';

import { React, PropTypes, mui, useEffect, useDispatch, useSelector, useMemo } from 'mylife-tools-ui';
import { getData } from '../selectors';
import { fetchInfos } from '../actions';
import Viewer from './viewer';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      data: getData(state),
    })),
    ...useMemo(() => ({
      fetchInfos: (path) => dispatch(fetchInfos(path)),
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

const Home = ({ path }) => {
  const classes = useStyles();
  const { data, fetchInfos } = useConnect();
  useEffect(() => { fetchInfos(path) }, [path]);

  return (
    <div className={classes.container}>
      <Viewer path={path} data={data} />
    </div>
  );
};

Home.propTypes = {
  path: PropTypes.string.isRequired
};

export default Home;
