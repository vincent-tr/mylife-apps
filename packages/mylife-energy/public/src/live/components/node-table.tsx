import { React, mui, useScreenPhone, useSelector, views } from 'mylife-tools-ui';
import { getMeasureView, getFirstDeviceByType, getDevicesByType } from '../selectors';
import { Measure } from '../../../../shared/metadata';
import { DeviceMeasure } from './common';

const NoteTable = () => {
  const nodes = useSelector(state => getDevicesByType(state, 'node'));
  const measures = useSelector(getMeasureView);
  const isPhone = useScreenPhone();

  return (
    <mui.Table size='small' stickyHeader>
      <mui.TableBody>
        {nodes.sortBy(device => findPowerMeasure(device._id, measures)).reverse().map(device => (
          <mui.TableRow key={device._id}>
            <mui.TableCell><Ratio deviceId={device._id} /></mui.TableCell>
            <mui.TableCell><mui.Typography>{device.display}</mui.Typography></mui.TableCell>
            <mui.TableCell><DeviceMeasure deviceId={device._id} /></mui.TableCell>
          </mui.TableRow>
        ))}
      </mui.TableBody>
    </mui.Table>
  );
};

export default NoteTable;

const useRatioStyles = mui.makeStyles(theme => ({
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
      <mui.LinearProgress className={classes.bar} variant='determinate' value={ratio} />
      <mui.Typography className={classes.label} variant='body2' color='textSecondary'>{`${ratio}%`}</mui.Typography>
    </div>
  );
}

function findPowerMeasure(deviceId: string, measures: views.View<Measure>) {
  const measure = measures.get(`${deviceId}-real-power`);
  return measure ? measure.value : NaN;
}
