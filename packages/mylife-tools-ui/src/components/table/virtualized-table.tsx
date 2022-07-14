import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { TableCell, makeStyles } from '@material-ui/core';

const identity = x => x;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  row: {
  },
  clickableRow: {
    // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/TableRow/TableRow.js
    '&:hover': {
      cursor: 'pointer',
      backgroundColor:
        theme.palette.type === 'light'
          ? 'rgba(0, 0, 0, 0.07)' // grey[200]
          : 'rgba(255, 255, 255, 0.14)',
    }
  },
  cell: {
    flex: 1
  }
}));

type FIXME_any = any;

interface VirtualizedTableProps {
  data: FIXME_any[];
  rowClassName?: string | ((row, index: number) => string);

  columns: {
    dataKey: string;
    cellRenderer?: string | React.ReactNode | ((cellData, dataKey) => string) | ((cellData, dataKey) => React.ReactNode);
    cellClassName?: string | ((cellData, dataKey) => string);
    headerRenderer: string | React.ReactNode | ((dataKey) => string) | ((dataKey) => React.ReactNode);
    headerClassName?: string | ((dataKey) => string);
    cellProps?;
    headerProps?;
    width?;
  }[];

  rowHeight?: number;
  headerHeight?: number;
  onRowClick?: (rowData, rowIndex: number) => void;
}

const VirtualizedTable: FunctionComponent<VirtualizedTableProps> = ({ data, columns, rowClassName, headerHeight, rowHeight, onRowClick, ...props }) => {
  const classes = useStyles();
  const rowIndexClassName = (({ index }) => clsx(classes.container, classes.row, classes.clickableRow, runPropGetter(rowClassName, data[index], index)));
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
                  cellRenderer={({ rowData, cellData, rowIndex }) => (
                    <TableCell onClick={onRowClick && (() => onRowClick(rowData, rowIndex))} component='div' className={clsx(classes.container, classes.cell, runPropGetter(cellClassName, cellData, dataKey))} variant='body' style={{ height: rowHeight }} {...runPropGetter(cellProps, cellData, dataKey)}>
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
    PropTypes.exact({
      dataKey: PropTypes.string.isRequired,
      cellRenderer: rendererType,
      cellClassName: classNameType,
      headerRenderer: rendererType.isRequired,
      headerClassName: classNameType
    }).isRequired
  ).isRequired,
  rowHeight: PropTypes.number,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func
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
