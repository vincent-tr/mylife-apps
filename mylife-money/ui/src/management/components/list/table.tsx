import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { useCallback } from 'react';
import { useScreenPhone, VirtualizedTable, VirtualizedTableColumn } from 'mylife-tools';
import Markdown from '../../../common/components/markdown';
import { useConnect, COLOR_AMOUNT_DEBIT, COLOR_AMOUNT_CREDIT, COLOR_FROM_CHILD, ControlledOperation } from './table-behaviors';

export type TableProps = Omit<React.ComponentProps<typeof VirtualizedTable>, 'data' | 'columns' | 'rowStyle' | 'onRowClick'>;

export default function Table(props: TableProps) {
  const { onSelect, onDetail, operations } = useConnect();
  const isPhone = useScreenPhone();
  const rowStyle = useCallback((row: ControlledOperation) => (row && row.fromChildGroup ? { backgroundColor: COLOR_FROM_CHILD } : null), []);
  const selectedCount = operations.reduce((acc, op) => (op.selected ? acc + 1 : acc), 0);

  const headerCheckbox = (
    <Checkbox
      color="primary"
      indeterminate={selectedCount > 0 && selectedCount < operations.length}
      checked={selectedCount === operations.length}
      onChange={(e) => onSelect({ selected: e.target.checked })}
    />
  );

  const cellCheckbox = useCallback((row: ControlledOperation) => <RowCheckbox row={row} onSelect={onSelect} />, [onSelect]);

  const noteRenderer = (value: any) => {
    const safeValue = (value as string) || '';
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
    //{ dataKey: 'account', width: 150, headerRenderer: 'Compte', cellDataGetter: ({ rowData }) => rowData.account && rowData.account.display },
    {
      dataKey: 'amount',
      width: 80,
      headerRenderer: 'Montant',
      cellDataGetter: ({ rowData }) => rowData.operation.amount,
      cellStyle: (value: number) => ({ backgroundColor: value < 0 ? COLOR_AMOUNT_DEBIT : COLOR_AMOUNT_CREDIT }),
    },
    { dataKey: 'date', width: 100, headerRenderer: 'Date', cellDataGetter: ({ rowData }) => new Date(rowData.operation.date).toLocaleDateString('fr-FR') }, // TODO: formatter
    { dataKey: 'label', headerRenderer: 'Libellé', cellDataGetter: ({ rowData }) => rowData.operation.label },
  ];
  if (!isPhone) {
    columns.push({ dataKey: 'note', headerRenderer: 'Note', cellDataGetter: ({ rowData }) => rowData.operation.note, cellRenderer: noteRenderer });
  }

  return <VirtualizedTable data={operations} columns={columns} {...props} rowStyle={rowStyle} onRowClick={(row) => onDetail(row.operation._id)} />;
}

interface RowCheckboxProps {
  row: ControlledOperation;
  onSelect: (selection: { id?: string | null; selected: boolean }) => void;
}

function RowCheckbox({ row, onSelect }: RowCheckboxProps) {
  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSelect({ id: row.operation._id, selected: e.target.checked });
    },
    [onSelect, row.operation._id]
  );

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return <Checkbox color="primary" checked={row.selected} onChange={handleSelect} onClick={handleClick} />;
}
