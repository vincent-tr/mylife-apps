'use strict';

import humanize from 'humanize';
import { React, PropTypes, mui, VirtualizedTable } from 'mylife-tools-ui';
import * as documentUtils from '../../../common/document-utils';

const useStyles = mui.makeStyles({
  noMaxWidth: {
    maxWidth: 'none',
  },
});

const LoadingErrorCell = ({ loadingError }) => {
  const classes = useStyles();
  const text = loadingError.split('\n').map((line, i) => (<p key={i}>{line}</p>));

  return (
    <div>
      <mui.Tooltip
        classes={{ tooltip: classes.noMaxWidth }}
        title={
          <mui.Typography component='div'>
            {text}
          </mui.Typography>
        }
      >
        <mui.icons.Error color='error'/>
      </mui.Tooltip>
    </div>
  );
};

LoadingErrorCell.propTypes = {
  loadingError: PropTypes.string.isRequired
};

const List = ({ documents, selection, setSelection, ...props }) => {
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

  const cellLoadingError = (loadingError) => (
    loadingError && (<LoadingErrorCell loadingError={loadingError} />)
  );

  const columns = [
    { dataKey: 'checkbox', width: 80, headerRenderer: headerCheckbox, cellDataGetter: ({ rowData }) => rowData, cellRenderer: cellCheckbox },
    { dataKey: 'title', headerRenderer: 'Titre', cellDataGetter: ({ rowData }) => documentUtils.getInfo(rowData).title },
    { dataKey: 'paths', headerRenderer: 'Chemins', cellDataGetter: ({ rowData }) => rowData.paths.map(p => p.path).join('; ') },
    { dataKey: 'fileSize', width: 100, headerRenderer: 'Taille', cellDataGetter: ({ rowData }) => humanize.filesize(rowData.fileSize) },
    { dataKey: 'loadingError', width: 100, headerRenderer: 'Erreur au chargement', cellRenderer: cellLoadingError }
  ];

  return (
    <VirtualizedTable data={documents} columns={columns} {...props} onRowClick={handleSelectClick}/>
  );
};

List.propTypes = {
  documents: PropTypes.array.isRequired,
  selection: PropTypes.object.isRequired,
  setSelection: PropTypes.func.isRequired
};

export default List;
