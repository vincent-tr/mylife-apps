import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';

const identity = x => x;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  flex: 1,
  // Support for clickable rows
  '.clickableRow &:hover': {
    cursor: 'pointer',
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'rgba(0, 0, 0, 0.07)' // grey[200]
        : 'rgba(255, 255, 255, 0.14)',
  }
}));

type FIXME_any = any;

export interface VirtualizedTableProps {
  data: FIXME_any[];
  rowClassName?: string | ((row, index: number) => string);
  rowStyle?: React.CSSProperties | ((row, index: number) => React.CSSProperties);

  columns: VirtualizedTableColumn[];

  rowHeight?: number;
  headerHeight?: number;
  onRowClick?: (rowData, rowIndex: number) => void;
}

export interface VirtualizedTableColumn {
  dataKey: string;
  cellDataGetter?;
  cellRenderer?: string | React.ReactNode | ((cellData, dataKey) => string) | ((cellData, dataKey) => React.ReactNode);
  cellClassName?: string | ((cellData, dataKey) => string);
  cellStyle?: React.CSSProperties | ((cellData, dataKey) => React.CSSProperties);
  headerRenderer: string | React.ReactNode | ((dataKey) => string) | ((dataKey) => React.ReactNode);
  headerClassName?: string | ((dataKey) => string);
  cellProps?;
  headerProps?;
  width?;
}

const VirtualizedTable: FunctionComponent<VirtualizedTableProps> = ({ 
  data, 
  columns, 
  rowClassName, 
  rowStyle, 
  headerHeight = 48, 
  rowHeight = 48, 
  onRowClick, 
  ...props 
}) => {
  //const rowIndexClassName = (({ index }) => clsx('container', 'row', 'clickableRow', runPropGetter(rowClassName, data[index], index)));
  const rowIndexStyle = (({ index }) => runPropGetter(rowStyle, data[index], index));
  const rowGetter = ({ index }) => data[index];

  return (
    <div {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <Table height={height} width={width} rowStyle={rowIndexStyle} rowGetter={rowGetter} rowCount={data.length} rowHeight={rowHeight} headerHeight={headerHeight}>
            {columns.map(({ dataKey, headerRenderer, headerClassName, cellRenderer, cellClassName, cellStyle, width: colWidth, headerProps, cellProps, ...props }) => {
              if (!colWidth) {
                colWidth = computeColumnWidth(width, columns);
              }

              return (
                <Column
                  key={dataKey}
                  dataKey={dataKey}
                  headerRenderer={() => (
                    <StyledTableCell component='div' className={runPropGetter(headerClassName, dataKey)} variant='head' style={{ height: headerHeight }} {...runPropGetter(headerProps, dataKey)}>
                      {runRenderer(headerRenderer, dataKey)}
                    </StyledTableCell>
                  )}
                  cellRenderer={({ rowData, cellData, rowIndex }) => (
                    <StyledTableCell onClick={onRowClick && (() => onRowClick(rowData, rowIndex))} component='div' className={runPropGetter(cellClassName, cellData, dataKey)} cellStyle={runPropGetter(cellStyle, cellData, dataKey)} variant='body' style={{ height: rowHeight }} {...runPropGetter(cellProps, cellData, dataKey)}>
                      {runRenderer(cellRenderer || identity, cellData, dataKey)}
                    </StyledTableCell>
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
