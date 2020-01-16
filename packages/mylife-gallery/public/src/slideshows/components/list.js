'use strict';

import { React, PropTypes, routing } from 'mylife-tools-ui';
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
  const slideshow = data[index];
  const { navigate } = routing.useRoutingConnect();
  const { title } = slideshow;
  const onClick = () => navigate(`/slideshow/${slideshow._id}`);
  const thumbnail = null // (<ThumbnailAlbum slideshow={album} />);

  return { title, thumbnail, onClick };
}
