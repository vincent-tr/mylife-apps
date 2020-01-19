'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import * as documentViewer from '../document-viewer';
import { ThumbnailDocument } from './thumbnail';
import ThumbnailList from './thumbnail-list';
import icons from './icons';

const DocumentThumbnailList = ({ data, ...props }) => (
  <ThumbnailList data={data} getTileInfo={getTileInfo} {...props} />
);

DocumentThumbnailList.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DocumentThumbnailList;

const useTypeMarkerStyles = mui.makeStyles({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 48,
    width: 48,
  },
  image: {
    height: '100%',
    width: '100%',
    color: 'rgba(0, 0, 0, 0.5)'
  }
});

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

function getTileInfo(data, index) {
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
