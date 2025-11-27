import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { views } from 'mylife-tools';
import { Measure } from '../../api';
import { getMeasureView, getFirstDeviceByType, makeGetDevicesByType } from '../selectors';
import { DeviceMeasure } from './common';

const Container = styled('div')({
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
});

const NoteTable = () => {
  const getDevicesByType = useMemo(() => makeGetDevicesByType(), []);
  const nodes = useSelector((state) => getDevicesByType(state, 'node'));
  const measures = useSelector(getMeasureView);

  return (
    <Container>
      <Table size="small" stickyHeader>
        <TableBody>
          {nodes
            .slice()
            .sort((a, b) => findPowerMeasure(b._id, measures) - findPowerMeasure(a._id, measures))
            .map((device) => (
              <TableRow key={device._id}>
                <TableCell>
                  <Ratio deviceId={device._id} />
                </TableCell>
                <TableCell>
                  <Typography>{device.display}</Typography>
                </TableCell>
                <TableCell>
                  <DeviceMeasure deviceId={device._id} sensorKeys={['real-power']} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default NoteTable;

const RatioContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: 100,
});

const RatioBar = styled(LinearProgress)(({ theme }) => ({
  width: '100%',
  marginRight: theme.spacing(1),
}));

const RatioLabel = styled(Typography)({
  minWidth: 35,
});

const Ratio: React.FC<{ deviceId: string }> = ({ deviceId }) => {
  const total = useSelector((state) => getFirstDeviceByType(state, 'total'));
  const measures = useSelector(getMeasureView);
  const totalPower = findPowerMeasure(total._id, measures);
  const power = findPowerMeasure(deviceId, measures);
  const ratio = Math.round((power / totalPower) * 100);

  return (
    <RatioContainer>
      <RatioBar variant="determinate" value={ratio} />
      <RatioLabel variant="body2" color="textSecondary">{`${ratio}%`}</RatioLabel>
    </RatioContainer>
  );
};

function findPowerMeasure(deviceId: string, measures: views.View<Measure>) {
  const measure = measures[`${deviceId}-real-power`];
  return measure ? measure.value : NaN;
}
