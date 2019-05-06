'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './table.scss';

const TableHeader = React.forwardRef(({ className, ...otherProps }, ref) => {
  return (
    <thead ref={ref} className={classNames('table-header', className)} {...otherProps} />
  );
});

TableHeader.displayName = 'TableHeader';

TableHeader.propTypes = {
  className: PropTypes.string,
};

TableHeader.defaultProps = {
};

export default TableHeader;
