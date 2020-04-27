'use strict';

import humanize from 'humanize';
import { React, PropTypes, mui, useState, useMemo, routing, VirtualizedTable, formatDate } from 'mylife-tools-ui';
import FileIcon from '../file-icon';
import { useIsSmallScreen } from '../behaviors';

const useStyles = mui.makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  }
}));

const Directory = ({ path, data, ...props }) => {
  const classes = useStyles();
  const { navigate } = routing.useRoutingConnect();
  const isSmallScreen = useIsSmallScreen();
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
  const list = useMemo(() => sortList(data.content, sort), [data.content, sort]);

  const changeSort = (key) => {
    if(sort.key === key) {
      setSort({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ key, direction: 'asc' });
    }
  };

  const cellName = (row) => (
    <>
      <FileIcon data={row} className={classes.icon} />
      {row.name}
    </>
  );

  const createHeaderRenderer = (label) => (dataKey) => (
    <mui.TableSortLabel 
      active={sort.key === dataKey}
      direction={sort.key === dataKey ? sort.direction : 'asc'}
      onClick={() => changeSort(dataKey)}
    >
      {label}
    </mui.TableSortLabel>
  );
  
  const columns = [
    { dataKey: 'name', headerRenderer: createHeaderRenderer('Nom'), cellDataGetter: ({ rowData }) => rowData, cellRenderer: cellName },
    !isSmallScreen && { dataKey: 'ctime', headerRenderer: createHeaderRenderer('Créé'), cellDataGetter: ({ rowData }) => formatTimestamp(rowData.ctime) },
    !isSmallScreen && { dataKey: 'mtime', headerRenderer: createHeaderRenderer('Modifié'), cellDataGetter: ({ rowData }) => formatTimestamp(rowData.mtime) },
    !isSmallScreen && { dataKey: 'atime', headerRenderer: createHeaderRenderer('Accédé'), cellDataGetter: ({ rowData }) => formatTimestamp(rowData.atime) },
    { dataKey: 'size', width: 100, headerRenderer: createHeaderRenderer('Taille'), cellDataGetter: ({ rowData }) => humanize.filesize(rowData.size) },
  ].filter(col => col);

  const handleSelectClick = (item) => {
    const url = path ? `/${path}/${item.name}` : `/${item.name}`;
    navigate(url);
  };

  return (
    <VirtualizedTable data={list} columns={columns} {...props} onRowClick={handleSelectClick} />
  );
  
};

Directory.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Directory;

function formatTimestamp(value) {
  return formatDate(value, 'dd/MM/yyyy HH:mm:ss');
}

function sortList(content, sort) {
  const comparer = (item1, item2) => {
    const value1 = item1[sort.key];
    const value2 = item2[sort.key];
    
    if(Object.is(value1, value2)) {
      return 0;
    }

    const diff = value1 < value2 ? -1 : 1;
    return sort.direction === 'asc' ? diff : -diff;
  };

  return content.slice().sort(comparer);
}