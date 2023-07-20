import { React, mui, chart, useActions, AutoSizer, useSelector, useLifecycle, immutable, useState, useChartColors } from 'mylife-tools-ui';
import { StatsType, fetchValues, enter, leave } from '../actions';
import { getChartData, getSensors } from '../selectors';
import DeviceList from './device-list';

const Stats: React.FunctionComponent = () => {
  useViewLifecycle();
  const actions = useActions({ fetchValues });
  const data = useSelector(getChartData);
  const sensors = useSelector(getSensors);
  const [value, onChange] = useState(immutable.Set<string>());
  const colors = useChartColors();

  return (
    <div>
      STATS
      <DeviceList value={value} onChange={onChange} />

      <mui.Button onClick={() => actions.fetchValues(StatsType.Day, new Date(2023, 6, 17), value.toArray())}>Compute</mui.Button>

      <div style={{height: 400, width: 800}}>
        <AutoSizer>
          {({ height, width }) => (
            <chart.BarChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}} height={height} width={width}>
              <chart.XAxis dataKey={item => item.timestamp.toLocaleTimeString()} />
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
