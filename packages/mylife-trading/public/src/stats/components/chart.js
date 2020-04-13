'use strict';

import { React, PropTypes, chart, useChartColors, AutoSizer } from 'mylife-tools-ui';

const Chart = ({ data, valueText, ...props }) => {
  const colors = useChartColors();

  return (
    <div {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <chart.LineChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}} height={height} width={width}>
            <chart.XAxis dataKey='date' name='Date' />
            <chart.YAxis name={valueText} />
            <chart.CartesianGrid strokeDasharray='3 3' />
            <chart.Tooltip />
            <chart.Line dataKey='value' stroke={colors[0]} name={valueText} />
          </chart.LineChart>
        )}
      </AutoSizer>
    </div>
  );
};

Chart.propTypes = {
  data: PropTypes.array.isRequired,
  valueText: PropTypes.string.isRequired,
};

export default Chart;
