'use strict';

import { React, useSelector, chart } from 'mylife-tools-ui';
import { getSortedTotalByMonth } from '../../selectors/reporting';

const useConnect = () => useSelector(state => ({
  data : getSortedTotalByMonth(state),
}));

const Stats = (props) => {
  const { data } = useConnect();
  console.log(data);

  return (
    <div {...props}>
      <chart.ResponsiveContainer>
        <chart.BarChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}}>
          <chart.XAxis dataKey="date" name="Date" />
          <chart.YAxis name="Montant" />
          <chart.CartesianGrid strokeDasharray="3 3"/>
          <chart.Tooltip/>
          <chart.Legend />
          {/*series.map(serie => (<chart.Bar key={serie.index} dataKey={`group-${serie.group}`} name={serie.display} fill={serie.fill} />))*/}
        </chart.BarChart>
      </chart.ResponsiveContainer>
    </div>
  );
};

export default Stats;
