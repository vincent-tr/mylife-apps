import React, { useMemo } from 'react';
import { styled, Table, TableBody, TableRow, TableCell, Typography, LinearProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { views } from 'mylife-tools-ui';
import { getMeasureView, getFirstDeviceByType, makeGetDevicesByType } from '../selectors';
import { Measure } from '../../../../shared/metadata';
import { DeviceMeasure } from './common';

const Container = styled('div')(({ theme }) => ({
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
}));

const NoteTable = () => {
  const getDevicesByType = useMemo(() => makeGetDevicesByType(), []);
  const nodes = useSelector(state => getDevicesByType(state, 'node'));
  const measures = useSelector(getMeasureView);

  return (
    <Container>
      <Table size='small' stickyHeader>
        <TableBody>
          {nodes.slice().sort((a, b) => findPowerMeasure(b._id, measures) - findPowerMeasure(a._id, measures)).map(device => (
            <TableRow key={device._id}>
              <TableCell><Ratio deviceId={device._id} /></TableCell>
              <TableCell><Typography>{device.display}</Typography></TableCell>
              <TableCell><DeviceMeasure deviceId={device._id} sensorKeys={['real-power']} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default NoteTable;

const RatioContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: 100,
}));

const RatioBar = styled(LinearProgress)(({ theme }) => ({
  width: '100%',
  marginRight: theme.spacing(1),
}));

const RatioLabel = styled(Typography)(({ theme }) => ({
  minWidth: 35,
}));

const Ratio: React.FC<{ deviceId: string }> = ({ deviceId }) => {
  const total = useSelector(state => getFirstDeviceByType(state, 'total'));
  const measures = useSelector(getMeasureView);
  const totalPower = findPowerMeasure(total._id, measures);
  const power = findPowerMeasure(deviceId, measures);
  const ratio = Math.round(power / totalPower * 100);

  return (
    <RatioContainer>
      <RatioBar variant='determinate' value={ratio} />
      <RatioLabel variant='body2' color='textSecondary'>{`${ratio}%`}</RatioLabel>
    </RatioContainer>
  );
}

function findPowerMeasure(deviceId: string, measures: views.View<Measure>) {
  const measure = measures[`${deviceId}-real-power`];
  return measure ? measure.value : NaN;
}
