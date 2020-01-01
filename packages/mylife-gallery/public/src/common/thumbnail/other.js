'use strict';

import { React, PropTypes, clsx } from 'mylife-tools-ui';
import { useCommonStyles } from './utils';
import icons from '../icons';

const ThumbnailOther = ({ document, className, ...props }) => {
  void document;
  const classes = useCommonStyles();
  return (
    <div className={clsx(classes.container, className)} {...props}>
      <icons.documents.None className={classes.fallback} />
    </div>
  );
};

ThumbnailOther.propTypes = {
  document: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default ThumbnailOther;
