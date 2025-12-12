import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import React, { useCallback } from 'react';
import { AutoSizer, Column, Index, Table } from 'react-virtualized';

const StyledTableCell = styled(TableCell)({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  flex: 1,
});

const StyledTable = styled(Table)(({ theme }) => ({
  '.ReactVirtualized__Table__row:hover': {
    cursor: 'pointer',
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'rgba(0, 0, 0, 0.07)' // grey[200]
        : 'rgba(255, 255, 255, 0.14)',
  },
}));

export interface VirtualizedTableProps<TData> {
  data: TData[];
  rowStyle?: React.CSSProperties | ((row: TData, index: number) => React.CSSProperties);

  columns: VirtualizedTableColumn[];

  rowHeight?: number;
  headerHeight?: number;
  onRowClick?: (rowData: TData, rowIndex: number) => void;
}

type AdditionalCellProps = Partial<React.ComponentProps<typeof TableCell>>;

export interface VirtualizedTableColumn extends Omit<React.ComponentProps<typeof Column>, 'dataKey' | 'headerRenderer' | 'cellRenderer' | 'width'> {
  dataKey: string;
  cellRenderer?: string | React.ReactNode | ((cellData: unknown, dataKey: string) => string) | ((cellData: unknown, dataKey: string) => React.ReactNode);
  cellStyle?: React.CSSProperties | ((cellData: unknown, dataKey: string) => React.CSSProperties);
  headerRenderer: string | React.ReactNode | ((dataKey: string) => string) | ((dataKey: string) => React.ReactNode);
  cellProps?: AdditionalCellProps | ((cellData: unknown, dataKey: string) => AdditionalCellProps);
  headerProps?: AdditionalCellProps | ((dataKey: string) => AdditionalCellProps);
  width?: number;
}

export default function VirtualizedTable<TData>({ data, columns, rowStyle, headerHeight = 48, rowHeight = 48, onRowClick, ...props }: VirtualizedTableProps<TData>) {
  const rowIndexStyle = useCallback(
    ({ index }: Index) => {
      const style = {
        ...runPropGetter(rowStyle, data[index], index),
        display: 'flex',
      };

      return style;
    },
    [rowStyle, data]
  );

  const rowGetter = useCallback(({ index }: Index) => data[index], [data]);

  return (
    <div {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <StyledTable height={height} width={width} rowStyle={rowIndexStyle} rowGetter={rowGetter} rowCount={data.length} rowHeight={rowHeight} headerHeight={headerHeight}>
            {columns.map(({ dataKey, headerRenderer, cellRenderer, cellStyle, width: colWidth, headerProps, cellProps, ...props }) => {
              if (!colWidth) {
                colWidth = computeColumnWidth(width, columns);
              }

              return (
                <Column
                  key={dataKey}
                  dataKey={dataKey}
                  headerRenderer={() => (
                    <StyledTableCell component="div" variant="head" style={{ height: headerHeight, width: colWidth }} {...runPropGetter(headerProps, dataKey)}>
                      {runRenderer(headerRenderer, dataKey)}
                    </StyledTableCell>
                  )}
                  cellRenderer={({ rowData, cellData, rowIndex }) => (
                    <StyledTableCell
                      component="div"
                      variant="body"
                      onClick={onRowClick && (() => onRowClick(rowData, rowIndex))}
                      style={{ height: rowHeight, width: colWidth, ...runPropGetter(cellStyle, cellData, dataKey) }}
                      {...runPropGetter(cellProps, cellData, dataKey)}
                    >
                      {runRenderer(cellRenderer || identity, cellData, dataKey)}
                    </StyledTableCell>
                  )}
                  width={colWidth}
                  {...props}
                />
              );
            })}
          </StyledTable>
        )}
      </AutoSizer>
    </div>
  );
}

function computeColumnWidth(tableWidth: number, columns: VirtualizedTableColumn[]) {
  // compute space left
  let unsetCount = columns.length;
  let specLeft = tableWidth;
  for (const { width } of columns) {
    if (!width) {
      continue;
    }
    --unsetCount;
    specLeft -= width;
  }

  const colWidth = specLeft / unsetCount;
  return Math.max(0, colWidth);
}

function runRenderer(value: React.ReactNode | ((...args: any[]) => React.ReactNode), ...args: any[]) {
  value = runPropGetter(value, ...args);

  if (typeof value !== 'string') {
    return value;
  }
  return <React.Fragment>{value}</React.Fragment>;
}

function runPropGetter<T>(value: T | ((...args: any[]) => T), ...args: any[]) {
  if (!value) {
    return;
  }
  if (value instanceof Function) {
    value = value(...args);
  }
  return value;
}

function identity<T>(x: T): T {
  return x;
}
