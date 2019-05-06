'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './table.scss';

const TableCell = React.forwardRef(({ className, ...otherProps }, ref) => {
  return (
    <td ref={ref} className={classNames('table-cell', className)} {...otherProps} />
  );
});

TableCell.displayName = 'TableCell';

TableCell.propTypes = {
  className: PropTypes.string,
};

TableCell.defaultProps = {
};

export default TableCell;
