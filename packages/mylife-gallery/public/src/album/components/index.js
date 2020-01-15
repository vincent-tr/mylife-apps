'use strict';

import { React, PropTypes, useMemo, mui, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';
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
      enter: (albumId) => dispatch(enter(albumId)),
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

const Album = ({ albumId }) => {
  const classes = useStyles();
  const { enter, leave, album, documents } = useConnect();
  useLifecycle(() => enter(albumId), leave);

  return (
    <div className={classes.container}>
      Album {JSON.stringify(album)}
    </div>
  );
};

Album.propTypes = {
  albumId: PropTypes.string.isRequired
};

export default Album;
