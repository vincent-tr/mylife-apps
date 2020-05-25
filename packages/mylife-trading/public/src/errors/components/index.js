'use strict';

import { React, mui, useMemo, formatDate, services, VirtualizedTable } from 'mylife-tools-ui';
import { useErrorView, useStrategyView } from '../../common/shared-views';
import MessageCell from './message-cell';

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto'
  }
});

const Errors = () => {
  const classes = useStyles();
  const { view } = useErrorView();
  const { view: strategyView } = useStrategyView();
  const data = useMemo(() => view.valueSeq().sortBy(error => error.date).toArray(), [view]);

  const strategyCellDataGetter = ({ rowData }) => {
    const strategy = strategyView.get(rowData.strategy);
    return strategy && services.renderObject(strategy);
  };

  const columns = [
    { dataKey: 'strategy', width: 300, headerRenderer: services.getFieldName('error', 'strategy'), cellDataGetter: strategyCellDataGetter },
    { dataKey: 'version', width: 80, headerRenderer: services.getFieldName('error', 'version') },
    { dataKey: 'date', width: 170, headerRenderer: services.getFieldName('error', 'date'), cellDataGetter: ({ rowData }) => formatTimestamp(rowData.date) },
    { dataKey: 'message', headerRenderer: services.getFieldName('error', 'message'), cellDataGetter: ({ rowData }) => rowData, cellRenderer: rowData => (<MessageCell rowData={rowData} />) }
  ];

  return (
    <VirtualizedTable data={data} columns={columns} className={classes.container} />
  );
};

export default Errors;

function formatTimestamp(value) {
  return formatDate(value, 'dd/MM/yyyy HH:mm:ss');
}