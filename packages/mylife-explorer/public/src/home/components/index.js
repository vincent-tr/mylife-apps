'use strict';

import { React, PropTypes, mui, useEffect, useDispatch, useSelector, useMemo, clsx, useScreenSize } from 'mylife-tools-ui';
import { getData, isShowDetail } from '../selectors';
import { fetchInfos } from '../actions';
import Viewer from './viewer';
import Detail from './detail';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      data: getData(state),
      isShowDetail: isShowDetail(state),
    })),
    ...useMemo(() => ({
      fetchInfos: (path) => dispatch(fetchInfos(path)),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flex: '1 1 auto',
  },
  viewer: {
    flex: '1 1 auto',
    minWidth: 0
  },
  detail: {
    overflowY: 'auto',

    // border
    borderLeftWidth: 1,
    borderLeftColor: mui.colors.grey[300],
    borderLeftStyle: 'solid',
  },
  detailLarge: {
    width: 350,
  },
  detailSmall: {
    minWidth: '100%',
    backgroundColor: theme.palette.background.paper,
  }
}));

const Home = ({ path }) => {
  const classes = useStyles();
  const { data, isShowDetail, fetchInfos } = useConnect();
  useEffect(() => { fetchInfos(path) }, [path]);
  const isSmallScreen = useIsSmallScreen();
  const detailClasses = clsx(classes.detail, isSmallScreen ? classes.detailSmall : classes.detailLarge);

  if(!data) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Viewer className={classes.viewer} path={path} data={data} />
      <mui.Slide direction='left' in={isShowDetail} mountOnEnter unmountOnExit>
        <Detail className={detailClasses} path={path} data={data} />
      </mui.Slide>
    </div>
  );
};

Home.propTypes = {
  path: PropTypes.string.isRequired
};

export default Home;

function useIsSmallScreen() {
  const screenSize = useScreenSize();

  switch(screenSize) {
    case 'phone':
      return true;

    case 'tablet':
    case 'laptop':
    case 'wide':
      return false;
  }
}
