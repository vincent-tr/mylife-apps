'use strict';

import { React, PropTypes, mui, VirtualizedTable } from 'mylife-tools-ui';
import { getPath } from './move-sorted-documents-tools';

const MoveSortedDocumentsList = ({ documents, selection, setSelection, ...props }) => {
  const selectOne = document => setSelection(set => set.add(document._id));
  const unselectOne = document => setSelection(set => set.delete(document._id));
  const selectAll = () => setSelection(set => set.union(documents.map(doc => doc._id)));
  const unselectAll = () => setSelection(set => set.clear());

  const handleSelectAllClick = () => {
    if(selection.size < documents.length) {
      selectAll();
    } else {
      unselectAll();
    }
  };

  const handleSelectClick = (document) => {
    if (selection.has(document._id)) {
      unselectOne(document);
    } else {
      selectOne(document);
    }
  };

  const headerCheckbox = (
    <mui.Checkbox
      color='primary'
      indeterminate={selection.size > 0 && selection.size < documents.length}
      checked={selection.size === documents.length}
      onChange={handleSelectAllClick}/>
  );

  const cellCheckbox = (row) => (
    <mui.Checkbox
      color='primary'
      checked={selection.has(row._id)}
      onChange={() => handleSelectClick(row)}
      onClick={event => event.stopPropagation()}/>
  );

  const columns = [
    { dataKey: 'checkbox', width: 80, headerRenderer: headerCheckbox, cellDataGetter: ({ rowData }) => rowData, cellRenderer: cellCheckbox },
    { dataKey: 'path', headerRenderer: 'Chemin', cellDataGetter: ({ rowData }) => getPath(rowData) }
  ];

  return (
    <VirtualizedTable data={documents} columns={columns} {...props} onRowClick={handleSelectClick}/>
  );
};

MoveSortedDocumentsList.propTypes = {
  documents: PropTypes.array.isRequired,
  selection: PropTypes.object.isRequired,
  setSelection: PropTypes.func.isRequired
};

export default MoveSortedDocumentsList;
