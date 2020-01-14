'use strict';

import { React, useMemo, mui, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getAlbum, getDocuments } from '../selectors';


const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      album: getAlbum(state),
      documents: getDocuments(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(enter()),
      leave: () => dispatch(leave()),
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

const Album = () => {
  const classes = useStyles();
  const { enter, leave, album, documents } = useConnect();
  useLifecycle(enter, leave);

  return (
    <div className={classes.container}>
      Album {JSON.stringify(album)}
    </div>
  );
};

export default Album;
