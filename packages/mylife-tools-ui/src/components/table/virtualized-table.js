'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { TableCell, makeStyles } from '@material-ui/core';

const identity = x => x;

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  row: {
  },
  cell: {
    flex: 1
  }
});

const VirtualizedTable = ({ data, columns, rowClassName, headerHeight, rowHeight, ...props }) => {
  const classes = useStyles();
  const rowIndexClassName = (({ index }) => clsx(classes.container, classes.row, runPropGetter(rowClassName, data[index], index)));
  const rowGetter = ({ index }) => data[index];

  return (
    <div {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <Table height={height} width={width} rowClassName={rowIndexClassName} rowGetter={rowGetter} rowCount={data.length} rowHeight={rowHeight} headerHeight={headerHeight}>
            {columns.map(({ dataKey, headerRenderer, headerClassName, cellRenderer, cellClassName, width: colWidth, headerProps, cellProps, ...props }) => {
              if (!colWidth) {
                colWidth = computeColumnWidth(width, columns);
              }

              return (
                <Column
                  key={dataKey}
                  dataKey={dataKey}
                  headerRenderer={() => (
                    <TableCell component='div' className={clsx(classes.container, classes.cell, runPropGetter(headerClassName, dataKey))} variant='head' style={{ height: headerHeight }} {...runPropGetter(headerProps, dataKey)}>
                      {runRenderer(headerRenderer, dataKey)}
                    </TableCell>
                  )}
                  cellRenderer={({ cellData }) => (
                    <TableCell component='div' className={clsx(classes.container, classes.cell, runPropGetter(cellClassName, cellData, dataKey))} variant='body' style={{ height: rowHeight }} {...runPropGetter(cellProps, cellData, dataKey)}>
                      {runRenderer(cellRenderer || identity, cellData, dataKey)}
                    </TableCell>
                  )}
                  width={colWidth}
                  {...props}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};

const rendererType = PropTypes.oneOfType([ PropTypes.string, PropTypes.node, PropTypes.func ]);
const classNameType = PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]);

VirtualizedTable.propTypes = {
  data: PropTypes.array.isRequired,
  rowClassName: classNameType,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      cellRenderer: rendererType,
      cellClassName: classNameType,
      headerRenderer: rendererType.isRequired,
      headerClassName: classNameType
    }).isRequired
  ).isRequired,
  rowHeight: PropTypes.number,
  headerHeight: PropTypes.number
};

VirtualizedTable.defaultProps = {
  headerHeight: 48,
  rowHeight: 48
};

export default VirtualizedTable;

function computeColumnWidth(tableWidth, columns) {
  // compute space left
  let unsetCount = columns.length;
  let specLeft = tableWidth;
  for(const { width } of columns) {
    if(!width) {
      continue;
    }
    --unsetCount;
    specLeft -= width;
  }

  const colWidth = specLeft / unsetCount;
  return Math.max(0, colWidth);
}

function runRenderer(value, ...args) {
  value = runPropGetter(value, ...args);

  if(typeof value !== 'string') {
    return value;
  }
  return (
    <React.Fragment>
      {value}
    </React.Fragment>
  );
}

function runPropGetter(value, ...args) {
  if(!value) {
    return;
  }
  if(value instanceof Function) {
    value = value(...args);
  }
  return value;
}
