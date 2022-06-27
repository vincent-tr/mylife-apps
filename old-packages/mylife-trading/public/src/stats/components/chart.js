'use strict';

import { React, PropTypes, chart, useChartColors, AutoSizer } from 'mylife-tools-ui';

const LineChart = ({ valueText, color, ...props }) => (
  <chart.LineChart {...props}>
    <chart.XAxis dataKey='date' name='Date' />
    <chart.YAxis name={valueText} />
    <chart.CartesianGrid strokeDasharray='3 3' />
    <chart.Tooltip />
    <chart.Line dataKey='value' stroke={color} name={valueText} />
  </chart.LineChart>
);

LineChart.propTypes = {
  valueText: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const BarChart = ({ valueText, color, ...props }) => (
  <chart.BarChart {...props}>
    <chart.XAxis dataKey='date' name='Date' />
    <chart.YAxis name={valueText} />
    <chart.CartesianGrid strokeDasharray='3 3' />
    <chart.Tooltip />
    <chart.Bar dataKey='value' fill={color} name={valueText} />
  </chart.BarChart>
)

BarChart.propTypes = {
  valueText: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const Chart = ({ data, valueText, chartType, ...props }) => {
  const [ color ] = useChartColors();
  const Chart = getChartType(chartType);

  return (
    <div {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <Chart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}} height={height} width={width} color={color} valueText={valueText} />
        )}
      </AutoSizer>
    </div>
  );
};

Chart.propTypes = {
  data: PropTypes.array.isRequired,
  valueText: PropTypes.string.isRequired,
  chartType: PropTypes.string.isRequired,
};

export default Chart;

function getChartType(type) {
  switch(type) {
    case 'bar-chart':
      return BarChart;
    case 'line-chart':
      return LineChart;
    default:
      throw new Error(`Unknown chart type: '${type}'`);
  }
}