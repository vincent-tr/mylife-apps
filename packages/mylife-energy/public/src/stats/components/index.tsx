import { React, mui, chart, useActions, useCallback, AutoSizer, useSelector, useLifecycle, immutable, views, useState, useMemo } from 'mylife-tools-ui';
import { StatsType, fetchValues, enter, leave } from '../actions';
import { getMeasures, getDevicesView } from '../selectors';
import DeviceList from './device-list';

const Stats: React.FunctionComponent = () => {
  useViewLifecycle();
  const actions = useActions({ fetchValues });
  const measures = useSelector(getMeasures);
  const [value, onChange] = useState(immutable.Set<string>());

  return (
    <div>
      STATS
      <DeviceList value={value} onChange={onChange} />

      <mui.Button onClick={() => actions.fetchValues(StatsType.Day, new Date(2023, 6, 17), ['epanel-baie-brassage'])}>Compute</mui.Button>

      <div style={{height: 400, width: 800}}>
        <AutoSizer>
          {({ height, width }) => (
            <chart.BarChart data={measures} margin={{top: 20, right: 20, left: 20, bottom: 20}} height={height} width={width}>
              {/* 
              <chart.XAxis dataKey={periodKey} name='Date' />
              <chart.YAxis name='Montant' />
              <chart.CartesianGrid strokeDasharray='3 3'/>
              <chart.Tooltip/>
              <chart.Legend />
              {bars.map(serie => (<chart.Bar key={serie.index} stackId={serie.stackId} dataKey={item => amountSelector(item, serie)} name={serie.name} fill={serie.fill} />))}
              */}
            <chart.Bar dataKey='value' fill='#82ca9d' />

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
