'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './table.scss';

const TableBody = React.forwardRef(({ className, ...otherProps }, ref) => {
  return (
    <tbody ref={ref} className={classNames('table-body', className)} {...otherProps} />
  );
});

TableBody.displayName = 'TableBody';

TableBody.propTypes = {
  className: PropTypes.string,
};

TableBody.defaultProps = {
};

export default TableBody;
