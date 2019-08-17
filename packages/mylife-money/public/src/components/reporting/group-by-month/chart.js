'use strict';

import { React, PropTypes,  chart, useSelector, useChartColors, AutoSizer } from 'mylife-tools-ui';
import { getGroupStacks, getChildrenList } from '../../../selectors/reference';

const useConnect = ({ childrenGroups, groups }) => {
  return useSelector(state => ({
    groupStacks : getGroupStacks(state),
    groupChildren: getChildren(state, childrenGroups, groups)
  }));
};

const Chart = ({ data, groups, childrenGroups, ...props }) => {

  const { groupStacks, groupChildren } = useConnect({ childrenGroups, groups });
  const colors = useChartColors();

  if(!data.length || !groups) { return null; }

  const bars = createBars(groups, childrenGroups, groupStacks, groupChildren, colors);

  return (
    <div {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <chart.BarChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}} height={height} width={width}>
            <chart.XAxis dataKey="month" name="Date" />
            <chart.YAxis name="Montant" />
            <chart.CartesianGrid strokeDasharray="3 3"/>
            <chart.Tooltip/>
            <chart.Legend />
            {bars.map(serie => (<chart.Bar key={serie.index} stackId={serie.stackId} dataKey={item => amount(item, serie)} name={serie.display} fill={serie.fill} />))}
          </chart.BarChart>
        )}
      </AutoSizer>
    </div>
  );
};

Chart.propTypes = {
  data: PropTypes.array.isRequired,
  groups: PropTypes.array,
  childrenGroups: PropTypes.bool
};

export default Chart;

function amount(monthItem, serie) {
  const item = monthItem.groups[serie.stackId];
  if(!item) {
    return 0;
  }

  if(serie.root) {
    return item.amount;
  }

  const childItem = item.children[serie.group];
  if(!childItem) {
    return  0;
  }
  return childItem.amount;
}

function getChildren(state, childrenGroups, groups) {
  if(!childrenGroups || !groups) {
    return {};
  }
  const result = {};
  for(const group of groups) {
    if(!group) {
      continue;
    }
    result[group] = getChildrenList(state, { group });
  }
  return result;
}

function createBars(groups, childrenGroups, groupStacks, groupChildren, colors) {
  const bars = [];
  let index = 0;
  for(const group of groups) {
    bars.push(createBar(colors, groupStacks, group, group, index++, true));
    if(childrenGroups) {
      for(const child of groupChildren[group]) {
        bars.push(createBar(colors, groupStacks, group, child, index++, false));
      }
    }
  }
  return bars;
}

function createBar(colors, groupStacks, stackId, group, index, root) {
  return {
    index,
    stackId,
    group,
    display : groupStacks.get(group).map(group => group.display).join('/'),
    fill    : colors[index % colors.length],
    root
  };
}
