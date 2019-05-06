'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './table.scss';

const Table = React.forwardRef(({ className, ...otherProps }, ref) => {
  return (
    <table ref={ref} className={classNames('table', className)} {...otherProps} />
  );
});

Table.displayName = 'Table';

Table.propTypes = {
  className: PropTypes.string,
};

Table.defaultProps = {
};

export default Table;
