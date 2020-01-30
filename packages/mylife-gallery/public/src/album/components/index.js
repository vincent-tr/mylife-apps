'use strict';

import { React, PropTypes, mui, useMemo, useSelector, useDispatch, useLifecycle, useSelectionSet } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getDocuments, isShowDetail } from '../selectors';
import DocumentList from '../../document-list/components';
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
  list: {
    flex: '1 1 auto'
  },
  detail: {
    width: 350,
    overflowY: 'auto',

    // border
    borderLeftWidth: 1,
    borderLeftColor: mui.colors.grey[300],
    borderLeftStyle: 'solid',
  },
});

const Album = ({ albumId }) => {
  const classes = useStyles();
  const { enter, leave, documents, isShowDetail } = useConnect();
  useLifecycle(() => enter(albumId), leave);
  const [selectedItems, onSelectionChange] = useSelectionSet(() => documents.map(doc => doc._id));
  const selectedDocuments = useMemo(
    () => documents
      .filter(docWithInfo => selectedItems.has(docWithInfo._id))
      .map(docWithInfo => docWithInfo.document),
    [documents, selectedItems]
  );

  return (
    <div className={classes.container}>
      <DocumentList className={classes.list} documents={documents} selectedItems={selectedItems} onSelectionChange={onSelectionChange} />
      <mui.Slide direction='left' in={isShowDetail} mountOnEnter unmountOnExit>
        <Detail className={classes.detail} selectedDocuments={selectedDocuments} />
      </mui.Slide>
    </div>
  );
};

Album.propTypes = {
  albumId: PropTypes.string.isRequired
};

export default Album;
