'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FixedSizeList } from 'react-window';
import { AutoSizer, Measure } from '../utils';

import './table.scss';

const Table = React.forwardRef(({ className, columns, data, ...otherProps }, ref) => {
  const [itemSize, setItemSize] = useState(1);

  const onRowMeasure=contentRect => {
    const { height } = contentRect.bounds;
    if(itemSize < height) {
      setItemSize(height);
    }
  };

  const Row = ({ index, style }) => (
    <div style={style}>
      <Measure bounds onResize={onRowMeasure}>
        {({ measureRef }) => (
          <div ref={measureRef}>
            {JSON.stringify(data[index])}
          </div>
        )}
      </Measure>
    </div>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList height={height} width={width} itemCount={data.length} itemSize={itemSize}>
          {Row}
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
