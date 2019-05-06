'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './table.scss';

const TableHeaderCell = React.forwardRef(({ className, ...otherProps }, ref) => {
  return (
    <th ref={ref} className={classNames('table-header-cell', className)} {...otherProps} />
  );
});

TableHeaderCell.displayName = 'TableHeaderCell';

TableHeaderCell.propTypes = {
  className: PropTypes.string,
};

TableHeaderCell.defaultProps = {
};

export default TableHeaderCell;
