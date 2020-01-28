'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import * as documentViewer from '../../document-viewer';
import { ThumbnailDocument } from '../../common/thumbnail';
import ThumbnailList from '../../common/thumbnail-list';
import icons from '../../common/icons';

const DocumentThumbnailList = ({ data, selectedItems, onSelectionChange, ...props }) => {
  const selectable = !!selectedItems && !!onSelectionChange;

  const getTileInfo = !selectable ?
    getBaseTileInfo :
    (data, index) => {
      const info = getBaseTileInfo(data, index);
      const id = data[index]._id;
      info.selected = selectedItems.has(id);
      info.onSelect = () => onSelectionChange({ id, selected: !info.selected });
      return info;
    };

  return (
    <ThumbnailList data={data} selectable={selectable} getTileInfo={getTileInfo} {...props} />
  );
};

DocumentThumbnailList.propTypes = {
  data: PropTypes.array.isRequired,
  selectedItems: PropTypes.object,
  onSelectionChange: PropTypes.func
};

export default DocumentThumbnailList;

const useTypeMarkerStyles = mui.makeStyles(theme => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 20,
    width: 20,
    borderWidth: 9,
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    borderRadius: '50%',
    borderColor: 'transparent',
    borderStyle: 'solid',
    color: theme.palette.common.black

  },
  image: {
    height: '100%',
    width: '100%',
  }
}));

const TypeMarker = ({ document }) => {
  const classes = useTypeMarkerStyles();

  const type = document._entity;
  if(type !== 'video') {
    return null;
  }

  return (
    <div className={classes.container}>
      <icons.documents.Video className={classes.image} />
    </div>
  );
};

TypeMarker.propTypes = {
  document: PropTypes.object.isRequired
};

function getBaseTileInfo(data, index) {
  const { document, info } = data[index];
  const { title, subtitle } = info;
  const onClick = () => showViewer(data, index);
  const thumbnail = (
    <>
      <TypeMarker document={document} />
      <ThumbnailDocument document={document} />
    </>
  );

  return { title, subtitle, thumbnail, onClick };
}

function showViewer(data, index) {
  const canPrev = () => index > 0;
  const canNext = () => index < data.length - 1;

  const onPrev = () => {
    --index;
    const document = data[index];
    return { type: document._entity, id: document._id };
  };

  const onNext = () => {
    ++index;
    const document = data[index];
    return { type: document._entity, id: document._id };
  };

  const document = data[index];
  documentViewer.showDialog(document._entity, document._id, { onPrev, onNext, canPrev, canNext });
}
