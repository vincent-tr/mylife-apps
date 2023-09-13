'use strict';

import { React, PropTypes, clsx } from 'mylife-tools-ui';
import { makeUrl } from '../tools';

const Pdf = ({ data, className, ...props }) => (
  <embed 
    src={makeUrl(data)}
    type='application/pdf'
    className={clsx(className)}
    {...props}
  />
);

Pdf.propTypes = {
  data: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default Pdf;
