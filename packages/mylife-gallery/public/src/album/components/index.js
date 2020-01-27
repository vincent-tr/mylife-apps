'use strict';

import { React, PropTypes, mui, immutable, useState, useMemo, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getDocuments, isShowDetail } from '../selectors';
import DocumentThumbnailList from '../../common/document-thumbnail-list';
import ListFooter from '../../common/list-footer';
import Detail from './detail';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      documents: getDocuments(state),
      isShowDetail: isShowDetail(state),
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
    flex: '1 1 auto',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
  },
  toolbar: {
    backgroundColor: mui.colors.grey[300]
  },
  list: {
    flex: '1 1 auto'
  },
  detail: {
    width: 350,
    overflowY: 'auto'
  },
});

const Album = ({ albumId }) => {
  const classes = useStyles();
  const { enter, leave, documents, isShowDetail } = useConnect();
  useLifecycle(() => enter(albumId), leave);
  const [selectedItems, setSelectedItems] = useState(new immutable.Set());
  const onSelectionChange = ({ id, selected }) => setSelectedItems(selected ? selectedItems.add(id) : selectedItems.delete(id));
  const showHeader = selectedItems.size > 0;

  return (
    <div className={classes.container}>
      <div className={classes.listContainer}>
        {showHeader && (
          <mui.Toolbar className={classes.toolbar}>
            <mui.Typography>
              {'header'}
            </mui.Typography>
          </mui.Toolbar>
        )}

        <DocumentThumbnailList className={classes.list} data={documents} selectedItems={selectedItems} onSelectionChange={onSelectionChange}/>
        <ListFooter text={`${documents.length} document(s)`} />
      </div>
      <mui.Slide direction='left' in={isShowDetail} mountOnEnter unmountOnExit>
        <Detail className={classes.detail} />
      </mui.Slide>
    </div>
  );
};

Album.propTypes = {
  albumId: PropTypes.string.isRequired
};

export default Album;
