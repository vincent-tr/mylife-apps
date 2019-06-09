'use strict';

import { React, useMemo, PropTypes,  chart, useSelector } from 'mylife-tools-ui';
import { makeGetGroupStacks } from '../../../selectors/groups';

const useConnect = () => {
  const getGroupStacks = useMemo(makeGetGroupStacks, []);
  return useSelector(state => ({
    groupStacks : getGroupStacks(state),
  }));
};

const styles = {
  chartWrapper: {
    height: 'calc(100% - 60px)'
  }
};

const Chart = ({ data, groups }) => {

  const { groupStacks } = useConnect();

  // http://materialuicolors.co/
  const colors = [
    '#EF9A9A', '#90CAF9', '#C5E1A5', '#FFAB91',
    '#F48FB1', '#81D4FA', '#E6EE9C', '#BCAAA4'
  ];

  if(!data.length) { return null; }

  const series = groups.map((group, index) => ({
    index,
    group,
    display : groupStacks.get(group).map(group => group.display).join('/'),
    fill    : colors[index % colors.length]
  }));

  return (
    <div style={styles.chartWrapper}>
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
  groups: PropTypes.array.isRequired
};

export default Chart;
