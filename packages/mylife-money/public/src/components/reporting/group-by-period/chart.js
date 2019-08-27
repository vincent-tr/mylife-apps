'use strict';

import { React, PropTypes,  chart, useSelector, useChartColors, AutoSizer } from 'mylife-tools-ui';
import { getGroupStacks, getChildrenList } from '../../../selectors/reference';

const useConnect = ({ display, groups }) => {
  return useSelector(state => ({
    groupStacks : getGroupStacks(state),
    groupChildren: getChildren(state, display, groups)
  }));
};

const Chart = ({ data, groups, display, periodKey, ...props }) => {
  const { groupStacks, groupChildren } = useConnect({ display, groups });
  const colors = useChartColors();

  if(!data.length || !groups) { return null; }

  const bars = createBars(groups, display, groupStacks, groupChildren, colors);

  return (
    <div {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <chart.BarChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}} height={height} width={width}>
            <chart.XAxis dataKey={periodKey} name='Date' />
            <chart.YAxis name='Montant' />
            <chart.CartesianGrid strokeDasharray='3 3'/>
            <chart.Tooltip/>
            <chart.Legend />
            {bars.map(serie => (<chart.Bar key={serie.index} stackId={serie.stackId} dataKey={item => amount(item, serie, display)} name={serie.name} fill={serie.fill} />))}
          </chart.BarChart>
        )}
      </AutoSizer>
    </div>
  );
};

Chart.propTypes = {
  data: PropTypes.array.isRequired,
  groups: PropTypes.array,
  display: PropTypes.object.isRequired,
  periodKey: PropTypes.string.isRequired,
};

export default Chart;

function amount(periodItem, serie, display) {
  const value = findAmount(periodItem, serie);
  return display.invert ? - value : value;
}

function findAmount(periodItem, serie) {
  const item = periodItem.groups[serie.stackId];
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

function getChildren(state, display, groups) {
  if(!display.children || !groups) {
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

function createBars(groups, display, groupStacks, groupChildren, colors) {
  const bars = [];
  let index = 0;
  for(const group of groups) {
    bars.push(createBar(colors, display, groupStacks, group, group, index++, true));
    if(display.children && group) {
      for(const child of groupChildren[group]) {
        bars.push(createBar(colors, display, groupStacks, group, child, index++, false));
      }
    }
  }
  return bars;
}

function createBar(colors, display, groupStacks, stackId, group, index, root) {
  const path = groupStacks.get(group).map(group => group.display);
  const name = display.fullnames ? path.join('/') : path[path.length - 1];
  return {
    index,
    stackId,
    group,
    name,
    fill: colors[index % colors.length],
    root
  };
}
