'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './table.scss';

const TableRow = React.forwardRef(({ className, ...otherProps }, ref) => {
  return (
    <tr ref={ref} className={classNames('table-row', className)} {...otherProps} />
  );
});

TableRow.displayName = 'TableRow';

TableRow.propTypes = {
  className: PropTypes.string,
};

TableRow.defaultProps = {
};

export default TableRow;
