import React, { useMemo } from 'react';
import { format as formatDate } from 'date-fns';
import { AutoSizer } from 'react-virtualized';
import { chart, useSelector, useChartColors } from 'mylife-tools-ui';
import { fr } from 'date-fns/locale';
import { StatsType } from '../actions';
import { getChartData, getSensors, TimestampData } from '../selectors';

const Chart: React.FunctionComponent<{ className?: string; type: StatsType}> = ({ className, type }) => {
  const data = useSelector(getChartData);
  const sensors = useSelector(getSensors);

  const dateFormatter = useAxisDateFormatter(type);
  const colors = useChartColors();

  return (
    <div className={className}>
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
  );
};

export default Chart;

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
