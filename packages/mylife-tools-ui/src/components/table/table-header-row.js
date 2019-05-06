'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './table.scss';

const TableHeaderRow = React.forwardRef(({ className, ...otherProps }, ref) => {
  return (
    <tr ref={ref} className={classNames('table-header-row', className)} {...otherProps} />
  );
});

TableHeaderRow.displayName = 'TableHeaderRow';

TableHeaderRow.propTypes = {
  className: PropTypes.string,
};

TableHeaderRow.defaultProps = {
};

export default TableHeaderRow;
