'use strict';

import { React, PropTypes, useDispatch, useSelector, useMemo } from 'mylife-tools-ui';
import { updateAlbum } from '../actions';
import { getAlbum} from '../selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      album: getAlbum(state),
    })),
    ...useMemo(() => ({
      updateAlbum: (album, values) => dispatch(updateAlbum(album, values)),
    }), [dispatch])
  };
};

const Detail = React.forwardRef(({ ...props }, ref) => {
  const { album, updateAlbum } = useConnect();
  return (
    <div ref={ref} {...props}>
      Detail
    </div>
  );
});
Detail.displayName = 'Detail';


export default Detail;