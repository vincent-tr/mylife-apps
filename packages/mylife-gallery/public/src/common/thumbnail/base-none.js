'use strict';

import { React, PropTypes, clsx } from 'mylife-tools-ui';
import { useCommonStyles } from './utils';
import icons from '../icons';

const BaseNone = ({ className, ...props }) => {
  const classes = useCommonStyles();
  return (
    <div className={clsx(classes.container, className)} {...props}>
      <icons.documents.None className={classes.fallback} />
    </div>
  );
};

BaseNone.propTypes = {
  className: PropTypes.string
};

export default BaseNone;
