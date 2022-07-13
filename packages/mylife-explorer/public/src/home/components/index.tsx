'use strict';

import { React, PropTypes, mui, useEffect, useDispatch, useSelector, useMemo, clsx, useScreenSize } from 'mylife-tools-ui';
import { getData, isShowDetail } from '../selectors';
import { fetchInfos, showDetail } from '../actions';
import { useIsSmallScreen } from './behaviors';
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
      showDetail: (show) => dispatch(showDetail(show)),
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

const NullDetail = React.forwardRef((props, ref) => (<div ref={ref} />));

const Home = ({ path }) => {
  const classes = useStyles();
  const { data, isShowDetail, showDetail, fetchInfos } = useConnect();
  const isSmallScreen = useIsSmallScreen();
  const detailClasses = clsx(classes.detail, isSmallScreen ? classes.detailSmall : classes.detailLarge);

  useEffect(() => { fetchInfos(path) }, [path]);
  useEffect(() => { showDetail(!isSmallScreen); }, [isSmallScreen]);

  return (
    <div className={classes.container}>
      {data && (
        <Viewer className={classes.viewer} data={data} />
      )}
      <mui.Slide direction='left' in={isShowDetail} mountOnEnter unmountOnExit>
        {data ? (
          <Detail className={detailClasses} data={data} />
        ) : (
          <NullDetail />
        )}
      </mui.Slide>
    </div>
  );
};

Home.propTypes = {
  path: PropTypes.string.isRequired
};

export default Home;

