'use strict';

import { React, PropTypes, useMemo, mui, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getAlbum, getDocuments } from '../selectors';
import DocumentThumbnailList from '../../common/document-thumbnail-list';
import ListFooter from '../../common/list-footer';

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
  },
  list: {
    flex: '1 1 auto'
  }
});

const Album = ({ albumId }) => {
  const classes = useStyles();
  const { enter, leave, album, documents } = useConnect();
  useLifecycle(() => enter(albumId), leave);

  return (
    <div className={classes.container}>
      <DocumentThumbnailList className={classes.list} data={documents}  />
      <ListFooter text={`${documents.length} document(s)`} />
    </div>
  );
};

Album.propTypes = {
  albumId: PropTypes.string.isRequired
};

export default Album;
