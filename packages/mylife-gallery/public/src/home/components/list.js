'use strict';

import { React, PropTypes, routing } from 'mylife-tools-ui';
import { ThumbnailAlbum } from '../../common/thumbnail';
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
  const album = data[index];
  const { navigate } = routing.useRoutingConnect();
  const { title } = album;
  const subtitle = `${album.documents.length} document(s)`;
  const onClick = () => navigate(`/album/${album._id}`);
  const thumbnail = (<ThumbnailAlbum album={album} />);

  return { title, subtitle, thumbnail, onClick };
}
