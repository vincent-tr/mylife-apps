import React from 'react';
import { useSelector } from 'react-redux';
import { views } from 'mylife-tools-ui';
import { getMeasureView, getFirstDeviceByType, getDevicesByType } from '../selectors';
import { Measure } from '../../../../shared/metadata';
import { DeviceMeasure } from './common';
import { makeStyles, Table, TableBody, TableRow, TableCell, Typography, LinearProgress } from '@material-ui/core';

const useTableStyles = makeStyles(theme => ({
  container: {
    flex: '1 1 auto',
    minHeight: 0,
    overflowY: 'auto',
  }
}));

const NoteTable = () => {
  const classes = useTableStyles();
  const nodes = useSelector(state => getDevicesByType(state, 'node'));
  const measures = useSelector(getMeasureView);

  return (
    <div className={classes.container}>
      <Table size='small' stickyHeader>
        <TableBody>
          {nodes.sortBy(device => findPowerMeasure(device._id, measures)).reverse().map(device => (
            <TableRow key={device._id}>
              <TableCell><Ratio deviceId={device._id} /></TableCell>
              <TableCell><Typography>{device.display}</Typography></TableCell>
              <TableCell><DeviceMeasure deviceId={device._id} sensorKeys={['real-power']} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NoteTable;

const useRatioStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: 100,
  },
  bar: {
    width: '100%',
    marginRight: theme.spacing(1),
  },
  label: {
    minWidth: 35,
  }
}));


const Ratio: React.FunctionComponent<{ deviceId: string }> = ({ deviceId }) => {
  const classes = useRatioStyles();

  const total = useSelector(state => getFirstDeviceByType(state, 'total'));
  const measures = useSelector(getMeasureView);
  const totalPower = findPowerMeasure(total._id, measures);
  const power = findPowerMeasure(deviceId, measures);
  const ratio = Math.round(power / totalPower * 100);

  return (
    <div className={classes.container}>
      <LinearProgress className={classes.bar} variant='determinate' value={ratio} />
      <Typography className={classes.label} variant='body2' color='textSecondary'>{`${ratio}%`}</Typography>
    </div>
  );
}

function findPowerMeasure(deviceId: string, measures: views.View<Measure>) {
  const measure = measures.get(`${deviceId}-real-power`);
  return measure ? measure.value : NaN;
}
