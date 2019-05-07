'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FixedSizeList } from 'react-window';
import { AutoSizer } from '../utils';

import './table.scss';

const Table = React.forwardRef(({ className, columns, data, ...otherProps }, ref) => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList height={height} width={width} itemCount={data.length} itemSize={35}>
          {({ index, style }) => (
            <div style={style}>
              {index}
            </div>
          )}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
});

Table.displayName = 'Table';

Table.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
};

Table.defaultProps = {
  data: []
};

export default Table;
