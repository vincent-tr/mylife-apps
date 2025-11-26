import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AutoSizer } from 'react-virtualized';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { useChartColors } from 'mylife-tools';
import { getChartData, getSensors } from '../store';
import { StatsType, TimestampData } from '../types';

const Chart: React.FC<{ className?: string; type: StatsType }> = ({ className, type }) => {
  const data = useSelector(getChartData);
  const sensors = useSelector(getSensors);

  const dateFormatter = useAxisDateFormatter(type);
  const colors = useChartColors();

  return (
    <div className={className}>
      <AutoSizer>
        {({ height, width }) => (
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }} height={height} width={width} style={{ fontFamily: 'Roboto, sans-serif' }}>
            <XAxis dataKey={dateFormatter} />
            <YAxis unit="Wh" />
            <Tooltip formatter={(value, _name, _props) => `${value} Wh`} />
            <Legend />
            {sensors.map((sensor, index) => (
              <Bar key={sensor._id} stackId={sensor._id} dataKey={(item) => Math.round(item.measures[sensor._id])} name={sensor.display} fill={colors[index % colors.length]} />
            ))}
          </BarChart>
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
        return (item: TimestampData) => formatDate(item.timestamp, 'HH:mm', { locale: fr });

      case StatsType.Month:
        return (item: TimestampData) => formatDate(item.timestamp, 'EEE d', { locale: fr });

      case StatsType.Year:
        return (item: TimestampData) => formatDate(item.timestamp, 'MMMM', { locale: fr });

      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }, [type]);
}
