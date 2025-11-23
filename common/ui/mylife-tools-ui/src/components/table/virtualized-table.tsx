import React, { FunctionComponent } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';

const identity = x => x;

const StyledTableCell = styled(TableCell)({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  flex: 1,
});

const StyledTable = styled('div')(({ theme }) => ({
  '.ReactVirtualized__Table__row:hover': {
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
  cellStyle?: React.CSSProperties | ((cellData, dataKey) => React.CSSProperties);
  headerRenderer: string | React.ReactNode | ((dataKey) => string) | ((dataKey) => React.ReactNode);
  cellProps?;
  headerProps?;
  width?: number;
}

const VirtualizedTable: FunctionComponent<VirtualizedTableProps> = ({ 
  data, 
  columns, 
  rowStyle, 
  headerHeight = 48, 
  rowHeight = 48, 
  onRowClick, 
  ...props 
}) => {
  const rowIndexStyle = ({ index }) => {
    const style = {
      ...runPropGetter(rowStyle, data[index], index),
      display: 'flex',
    };

    return style;
  };
  const rowGetter = ({ index }) => data[index];

  return (
    <StyledTable {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <Table height={height} width={width} rowStyle={rowIndexStyle} rowGetter={rowGetter} rowCount={data.length} rowHeight={rowHeight} headerHeight={headerHeight}>
            {columns.map(({ dataKey, headerRenderer, cellRenderer, cellStyle, width: colWidth, headerProps, cellProps, ...props }) => {
              if (!colWidth) {
                colWidth = computeColumnWidth(width, columns);
              }

              return (
                <Column
                  key={dataKey}
                  dataKey={dataKey}
                  headerRenderer={() => (
                    <StyledTableCell variant='head' style={{ height: headerHeight, width: colWidth }} {...runPropGetter(headerProps, dataKey)}>
                      {runRenderer(headerRenderer, dataKey)}
                    </StyledTableCell>
                  )}
                  cellRenderer={({ rowData, cellData, rowIndex }) => (
                    <StyledTableCell onClick={onRowClick && (() => onRowClick(rowData, rowIndex))} style={{ height: rowHeight, width: colWidth, ...runPropGetter(cellStyle, cellData, dataKey)}} variant='body'>
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
    </StyledTable>
  );
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
