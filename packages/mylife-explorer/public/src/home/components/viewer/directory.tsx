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

interface Sort {
  key: string;
  direction: 'asc' | 'desc';
}

const Directory = ({ data, ...props }) => {
  const classes = useStyles();
  const { navigate } = routing.useRoutingConnect();
  const isSmallScreen = useIsSmallScreen();
  const [sort, setSort] = useState<Sort>({ key: 'name', direction: 'asc' });
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
    !isSmallScreen && { dataKey: 'ctime', width: 180, headerRenderer: createHeaderRenderer('Créé'), cellDataGetter: ({ rowData }) => formatTimestamp(rowData.ctime) },
    !isSmallScreen && { dataKey: 'mtime', width: 180, headerRenderer: createHeaderRenderer('Modifié'), cellDataGetter: ({ rowData }) => formatTimestamp(rowData.mtime) },
    !isSmallScreen && { dataKey: 'atime', width: 180, headerRenderer: createHeaderRenderer('Accédé'), cellDataGetter: ({ rowData }) => formatTimestamp(rowData.atime) },
    { dataKey: 'size', width: 130, headerRenderer: createHeaderRenderer('Taille'), cellDataGetter: ({ rowData }) => humanize.filesize(rowData.size) },
  ].filter(col => col);

  const handleSelectClick = (item) => {
    const url = data.path ? `/${data.path}/${item.name}` : `/${item.name}`;
    navigate(url);
  };

  return (
    <VirtualizedTable data={list} columns={columns} {...props} onRowClick={handleSelectClick} />
  );
  
};

Directory.propTypes = {
  data: PropTypes.object.isRequired
};

export default Directory;

function formatTimestamp(value) {
  return formatDate(value, 'dd/MM/yyyy HH:mm:ss');
}

function sortList(content, sort) {
  const comparer = createsortComparer(sort);

  return content.slice().sort(comparer);
}

function createsortComparer(sort) {
  if(sort.key === 'name') {
    // sort by directoy/file then name
    return (item1, item2) => {
      const type1 = typeToSortable(item1);
      const type2 = typeToSortable(item2);

      if (type1 !== type2) {
        return compareValue(type1, type2, sort.direction);
      }

      return compareValue(item1.name, item2.name, sort.direction);
    }
  }

  // default comparer
  return (item1, item2) => {
    const value1 = item1[sort.key];
    const value2 = item2[sort.key];
    return compareValue(value1, value2, sort.direction);
  };
}

function compareValue(value1, value2, direction) {
  if(Object.is(value1, value2)) {
    return 0;
  }

  const diff = value1 < value2 ? -1 : 1;
  return direction === 'asc' ? diff : -diff;
}

function typeToSortable(data) {
  switch(data.type) {
    case 'Directory':
      return 0;
    case 'File':
      return 1;
    default:
      return 2;
  }
}