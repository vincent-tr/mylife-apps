'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import * as documentViewer from '../../document-viewer';
import { ThumbnailDocument } from '../../common/thumbnail';
import ThumbnailList from '../../common/thumbnail-list';

const List = ({ data, ...props }) => (
  <ThumbnailList data={data} getTileInfo={getTileInfo} {...props} />
);

List.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default List;

function getTileInfo(data, index) {
  const { document, info } = data[index];
  const { title, subtitle } = info;
  const onClick = () => showViewer(data, index);
  const thumbnail = (<ThumbnailDocument document={document} />);

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
