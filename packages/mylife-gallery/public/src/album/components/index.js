'use strict';

import { React, PropTypes, mui, useMemo, useSelector, useDispatch, useLifecycle, useSelectionSet } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getDocuments, isShowDetail } from '../selectors';
import DocumentThumbnailList from '../../common/document-thumbnail-list';
import ListFooter from '../../common/list-footer';
import Header from './header';
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
  const [selectedItems, onSelectionChange] = useSelectionSet(() => documents.map(doc => doc._id));

  return (
    <div className={classes.container}>
      <div className={classes.listContainer}>
        <Header totalCount={documents.length} selectedItems={selectedItems} onSelectionChange={onSelectionChange} />
        <DocumentThumbnailList className={classes.list} data={documents} selectedItems={selectedItems} onSelectionChange={onSelectionChange}/>
        <ListFooter text={getFooterText(documents, selectedItems)} />
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

function getFooterText(documents, selectedItems) {
  const base = `${documents.length} document(s)`;
  if(selectedItems.size === 0) {
    return base;
  }
  return `${base} - ${selectedItems.size} sélectionné(s)`;
}
