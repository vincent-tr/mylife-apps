import { React, mui, chart, useActions, AutoSizer, useSelector, useLifecycle, immutable, useState, useChartColors, useMemo, formatDate } from 'mylife-tools-ui';
import { fr } from 'date-fns/locale'
import { StatsType, fetchValues, enter, leave } from '../actions';
import { getChartData, getSensors, TimestampData } from '../selectors';
import DeviceList from './device-list';
import TypeList from './type-list';

const Stats: React.FunctionComponent = () => {
  useViewLifecycle();
  const actions = useActions({ fetchValues });
  const data = useSelector(getChartData);
  const sensors = useSelector(getSensors);
  const [devices, onDevicesChange] = useState(immutable.Set<string>());
  const [type, onTypeChange] = useState(StatsType.Day);
  const dateFormatter = useAxisDateFormatter(type);
  const colors = useChartColors();

  return (
    <div>
      STATS
      <DeviceList value={devices} onChange={onDevicesChange} />
      <TypeList value={type} onChange={onTypeChange} />


      <mui.Button onClick={() => actions.fetchValues(type, new Date(2023, 6, 17), devices.toArray())}>Compute</mui.Button>

      <div style={{height: 400, width: 800}}>
        <AutoSizer>
          {({ height, width }) => (
            <chart.BarChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}} height={height} width={width}>
              <chart.XAxis dataKey={dateFormatter} />
              <chart.YAxis unit='Wh' />
              <chart.Tooltip formatter={(value, name, props) => `${value} Wh`}/>
              <chart.Legend/>
              {sensors.map((sensor, index) => (
                <chart.Bar key={sensor._id} stackId={sensor._id} dataKey={item => Math.round(item.measures[sensor._id])} name={sensor.display} fill={colors[index % colors.length]} />
              ))}

            </chart.BarChart>
          )}
        </AutoSizer>
      </div>

    </div>
  );
};

export default Stats;

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}

function useAxisDateFormatter(type: StatsType) {
  return useMemo(() => {

    switch (type) {
      case StatsType.Day:
        return (item: TimestampData) => formatDate(item.timestamp, 'HH:mm', {locale: fr});

      case StatsType.Month:
        return (item: TimestampData) => formatDate(item.timestamp, 'EEE d', {locale: fr});

      case StatsType.Year:
        return (item: TimestampData) => formatDate(item.timestamp, 'MMMM', {locale: fr});

      default:
        throw new Error(`Unknown type: ${type}`);
    }

  }, [type]);
}

/*

TODO:
- layout
- autre types de calcul

*/