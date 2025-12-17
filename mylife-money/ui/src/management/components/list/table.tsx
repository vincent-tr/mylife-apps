import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { useCallback, useMemo } from 'react';
import { useScreenPhone, VirtualizedTable, VirtualizedTableColumn } from 'mylife-tools';
import { Operation } from '../../../api';
import Markdown from '../../../common/components/markdown';
import { useAppAction, useAppSelector } from '../../../store-api';
import { getSelectedGroupId, getSelectedOperationIds, getSortedOperations, selectOperation, showDetail } from '../../store';
import * as colors from './colors';

export type TableProps = Omit<React.ComponentProps<typeof VirtualizedTable>, 'data' | 'columns' | 'rowStyle' | 'onRowClick'>;

export default function Table(props: TableProps) {
  const onSelect = useAppAction(selectOperation);
  const onDetail = useAppAction(showDetail);
  const selectedOperationIds = useAppSelector(getSelectedOperationIds);
  const selectedGroup = useAppSelector(getSelectedGroupId) || null;
  const operations = useAppSelector(getSortedOperations);
  const isPhone = useScreenPhone();
  const selectedCount = Object.keys(selectedOperationIds).length;

  const rowStyle = useCallback((row: Operation) => (row && row.group !== selectedGroup ? { backgroundColor: colors.fromChild } : null), [selectedGroup]);

  const onRowClick = useCallback(
    (operation: Operation) => {
      onDetail(operation._id);
    },
    [onDetail]
  );

  const columns = useMemo(() => {
    const headerCheckbox = (
      <Checkbox
        color="primary"
        indeterminate={selectedCount > 0 && selectedCount < operations.length}
        checked={selectedCount === operations.length}
        onChange={(e) => onSelect({ selected: e.target.checked })}
      />
    );

    const cellCheckbox = (row: Operation) => <RowCheckbox row={row} />;

    const noteRenderer = (value: string) => {
      const safeValue = value || '';
      const lines = safeValue.split('\n');
      if (lines.length > 1) {
        return (
          <Tooltip title={<Markdown value={value} />}>
            <div>
              <Markdown value={`${lines[0]} ...`} />
            </div>
          </Tooltip>
        );
      } else {
        return <Markdown value={value} />;
      }
    };

    const columns: VirtualizedTableColumn[] = [
      { dataKey: 'checkbox', width: isPhone ? 60 : 80, headerRenderer: headerCheckbox, cellDataGetter: ({ rowData }) => rowData, cellRenderer: cellCheckbox },
      {
        dataKey: 'amount',
        width: 80,
        headerRenderer: 'Montant',
        cellDataGetter: ({ rowData }) => rowData.amount,
        cellStyle: (value: number) => ({ backgroundColor: value < 0 ? colors.debit : colors.credit }),
      },
      { dataKey: 'date', width: 100, headerRenderer: 'Date', cellDataGetter: ({ rowData }) => new Date(rowData.date).toLocaleDateString('fr-FR') },
      { dataKey: 'label', headerRenderer: 'Libellé', cellDataGetter: ({ rowData }) => rowData.label },
    ];

    if (!isPhone) {
      columns.push({ dataKey: 'note', headerRenderer: 'Note', cellDataGetter: ({ rowData }) => rowData.note, cellRenderer: noteRenderer });
    }

    return columns;
  }, [isPhone, onSelect, operations.length, selectedCount]);

  return <VirtualizedTable data={operations} columns={columns} {...props} rowStyle={rowStyle} onRowClick={onRowClick} />;
}

interface RowCheckboxProps {
  row: Operation;
}

function RowCheckbox({ row }: RowCheckboxProps) {
  const onSelect = useAppAction(selectOperation);
  const selectedOperationIds = useAppSelector(getSelectedOperationIds);
  const id = row._id;
  const selected = !!selectedOperationIds[id];

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSelect({ id, selected: e.target.checked });
    },
    [onSelect, id]
  );

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return <Checkbox color="primary" checked={selected} onChange={handleSelect} onClick={handleClick} />;
}
