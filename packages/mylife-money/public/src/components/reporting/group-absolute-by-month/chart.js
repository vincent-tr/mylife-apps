'use strict';

import { React, PropTypes,  chart, useSelector, useChartColors } from 'mylife-tools-ui';
import { getGroupStacks } from '../../../selectors/reference';

const useConnect = () => {
  return useSelector(state => ({
    groupStacks : getGroupStacks(state),
  }));
};

const Chart = ({ data, groups, ...props }) => {

  const { groupStacks } = useConnect();
  const colors = useChartColors();

  if(!data.length || !groups) { return null; }

  const series = groups.map((group, index) => ({
    index,
    group,
    display : console.log(groupStacks.get(group)) || groupStacks.get(group).map(group => group.display).join('/'),
    fill    : colors[index % colors.length]
  }));

  return (
    <div {...props}>
      <chart.ResponsiveContainer>
        <chart.BarChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}}>
          <chart.XAxis dataKey="date" name="Date" />
          <chart.YAxis name="Montant" />
          <chart.CartesianGrid strokeDasharray="3 3"/>
          <chart.Tooltip/>
          <chart.Legend />
          {series.map(serie => (<chart.Bar key={serie.index} dataKey={`group-${serie.group}`} name={serie.display} fill={serie.fill} />))}
        </chart.BarChart>
      </chart.ResponsiveContainer>
    </div>
  );
};

Chart.propTypes = {
  data: PropTypes.array.isRequired,
  groups: PropTypes.array
};

export default Chart;
