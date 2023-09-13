import { React, PropTypes, mui, useMemo, useSelector, useDispatch, useLifecycle, useSelectionSet, clsx } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getDocuments, isShowDetail } from '../selectors';
import DocumentList from '../../document-list/components';
import Detail from './detail';
import { useIsSmallScreen } from './behaviors';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
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

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flex: '1 1 auto',
  },
  list: {
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

const Album = ({ albumId }) => {
  const classes = useStyles();
  const isSmallScreen = useIsSmallScreen();
  const { enter, leave, documents, isShowDetail } = useConnect();
  useLifecycle(() => enter(albumId), leave);
  const [selectedItems, onSelectionChange] = useSelectionSet(() => documents.map(doc => doc._id));
  const selectedDocuments = useMemo(
    () => documents
      .filter(docWithInfo => selectedItems.has(docWithInfo._id))
      .map(docWithInfo => docWithInfo.document),
    [documents, selectedItems]
  );

  const detailClasses = clsx(classes.detail, isSmallScreen ? classes.detailSmall : classes.detailLarge);
  return (
    <div className={classes.container}>
      <DocumentList className={classes.list} documents={documents} selectedItems={selectedItems} onSelectionChange={onSelectionChange} />
      <mui.Slide direction='left' in={isShowDetail} mountOnEnter unmountOnExit>
        <Detail className={detailClasses} selectedDocuments={selectedDocuments} />
      </mui.Slide>
    </div>
  );
};

Album.propTypes = {
  albumId: PropTypes.string.isRequired
};

export default Album;
