'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FixedSizeList } from 'react-window';
import { AutoSizer, Measure } from '../utils';
import { Box } from '../containers';

import './table.scss';

const HeaderCell = ({ column }) => {
  if(column.headerRenderer) {
    return column.headerRenderer(column);
  }

  return (
    <div className={classNames('table-header-cell', column.headerClassName)} style={getColumnStyle(column)}>
      {column.text}
    </div>
  );
};

HeaderCell.propTypes = {
  column: PropTypes.object.isRequired
};

const Header = ({ headerClassName, columns, width }) => (
  <div style={{ width }} className={classNames('table-header', headerClassName)}>
    {columns.map(column => (
      <HeaderCell key={column.id} column={column} />
    ))}
  </div>
);

Header.propTypes = {
  headerClassName: PropTypes.string,
  columns: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired
};

const Cell = ({ column, row }) => {
  const value = row[column.id];
  if(column.renderer) {
    return column.renderer(value, column);
  }

  return (
    <div className={classNames('table-cell', column.className)} style={getColumnStyle(column)}>
      {value}
    </div>
  );
};

Cell.propTypes = {
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
};

const Row = React.forwardRef(({ rowClassName, columns, row }, ref) => (
  <div ref={ref} className={classNames('table-row', rowClassName)}>
    {columns.map(column => (
      <Cell key={column.id} column={column} row={row} />
    ))}
  </div>
));

Row.displayName = 'Row';

Row.propTypes = {
  rowClassName: PropTypes.string,
  columns: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
};

const Table = React.forwardRef(({ className, headerClassName, bodyClassName, rowClassName, columns, data, ...otherProps }, ref) => {
  const [itemHeight, setItemHeight] = useState(1);
  const [itemWidth, setItemWidth] = useState(1);

  const onRowMeasure=contentRect => {
    const { height, width } = contentRect.bounds;
    if(itemHeight < height) {
      setItemHeight(height);
    }
    if(itemWidth !== width) {
      setItemWidth(width);
    }
  };

  return (
    <Box ref={ref} className={classNames('table', className)} {...otherProps}>
      <Header headerClassName={headerClassName} columns={columns} width={itemWidth}/>
      <div className={classNames('table-body', bodyClassName)}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList height={height} width={width} itemCount={data.length} itemSize={itemHeight}>
              {({ index, style }) => (
                <div style={style}>
                  <Measure bounds onResize={onRowMeasure}>
                    {({ measureRef }) => (
                      <Row ref={measureRef} rowClassName={rowClassName} columns={columns} row={data[index]} />
                    )}
                  </Measure>
                </div>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </Box>
  );
});

Table.displayName = 'Table';

Table.propTypes = {
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
};

Table.defaultProps = {
  data: []
};

export default Table;

function getColumnStyle({ width = 1 }) {
  return { flex: `${width} ${width} auto` };
}
