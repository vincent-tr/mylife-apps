'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';
import { useImage, useCommonStyles } from './utils';
import icons from '../icons';

const NotNull = ({ thumbnail }) => {
  const classes = useCommonStyles();
  const imageUrl = useImage(thumbnail);
  const loading = !imageUrl;

  if(loading) {
    return (
      <mui.CircularProgress className={classes.loading} />
    );
  }

  return (
    <img src={imageUrl} />
  );
};

NotNull.propTypes = {
  thumbnail: PropTypes.string.isRequired
};

const BaseMono = ({ thumbnail, className, ...props }) => {
  const classes = useCommonStyles();
  return (
    <div className={clsx(classes.container, className)} {...props}>
      {thumbnail ? (
        <NotNull thumbnail={thumbnail}/>
      ) : (
        <icons.documents.None className={classes.fallback} />
      )}
    </div>
  );
};

BaseMono.propTypes = {
  thumbnail: PropTypes.string,
  className: PropTypes.string
};

export default BaseMono;
