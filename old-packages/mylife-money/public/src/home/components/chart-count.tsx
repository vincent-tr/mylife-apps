'use strict';

import { React, chart, useChartColors } from 'mylife-tools-ui';
import { useTotalByMonth } from '../views';

const ChartCount = (props) => {
  const { sorted: data } = useTotalByMonth();
  const [ color ] = useChartColors();

  return (
    <div {...props}>
      <chart.LineChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}} width={600} height={400}>
        <chart.XAxis dataKey='month' name='Mois' />
        <chart.YAxis/>
        <chart.CartesianGrid strokeDasharray='3 3'/>
        <chart.Tooltip/>
        <chart.Legend />
        <chart.Line type='monotone' dataKey='count' stroke={color} name="Nombre d'opérations" />
      </chart.LineChart>
    </div>
  );
};

export default ChartCount;
