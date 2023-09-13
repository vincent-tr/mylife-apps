import { React, PropTypes, mui, dialogs, useLifecycle, useDispatch, useSelector, useMemo, services } from 'mylife-tools-ui';
import ThumbnailList from '../../common/thumbnail-list';
import { ThumbnailMono, THUMBNAIL_SIZE } from '../../common/thumbnail';
import { getSelectorView } from '../selectors';
import { enterSelector, leaveSelector } from '../actions';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      documentView: getSelectorView(state)
    })),
    ...useMemo(() => ({
      enterSelector: (personId) => dispatch(enterSelector(personId)),
      leaveSelector: () => dispatch(leaveSelector()),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  content: {
    height: '60vh',
    display: 'flex',
  },
  list: {
    flex: '1 1 auto'
  },
  thumbnail: {
    // size + position
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,

    // inner img positionning
    position: 'relative',
    '& > img': {
      position: 'absolute',
      margin: 'auto',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }
  },
});

const ThumbnailSelectorDialog = ({ options, show, proceed }) => {
  const classes = useStyles();
  const { person } = options;
  const { enterSelector, leaveSelector, documentView } = useConnect();
  useLifecycle(() => enterSelector(person._id), leaveSelector);

  const thumbnails = useMemo(() => extractThumbnails(documentView), [documentView]);

  const handleCancel = () => proceed({ result: 'cancel' });

  const getTileInfo = (data, index) => {
    const thumbnail = data[index];
    const onClick = () => proceed({ result: 'ok', thumbnail });
    const thumbnailNode = (<ThumbnailMono thumbnail={thumbnail} className={classes.thumbnail}/>);

    return { thumbnail: thumbnailNode, onClick };
  };

  return (
    <mui.Dialog aria-labelledby='dialog-title' open={show} onClose={handleCancel} maxWidth='md' fullWidth>
      <mui.DialogTitle id='dialog-title'>
        {`Sélectionner la miniature à utiliser pour '${services.renderObject(person)}'`}
      </mui.DialogTitle>

      <mui.DialogContent dividers className={classes.content}>
        <ThumbnailList data={thumbnails} getTileInfo={getTileInfo} className={classes.list} />
      </mui.DialogContent>

      <mui.DialogActions>
        <mui.Button onClick={handleCancel}>Annuler</mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
  );
};

ThumbnailSelectorDialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool,
  proceed: PropTypes.func
};

const showDialog = dialogs.create(ThumbnailSelectorDialog);

export const thumbnailSelectorDialog = async (person) => showDialog({ options: { person } });

function extractThumbnails(documentView) {
  const thumbnails = [];
  for(const { document } of documentView.values()) {
    switch(document._entity) {

      case 'image': {
        thumbnails.push(document.thumbnail);
        break;
      }

      case 'video': {
        for(const thumbnail of document.thumbnails) {
          thumbnails.push(thumbnail);
        }
        break;
      }

    }
  }
  return thumbnails;
}
