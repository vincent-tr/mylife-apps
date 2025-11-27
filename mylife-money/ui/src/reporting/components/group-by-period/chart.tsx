import React from 'react';
import { useSelector } from 'react-redux';
import { AutoSizer } from 'react-virtualized';
import { BarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Bar } from 'recharts';
import { useChartColors } from 'mylife-tools';
import { getGroupStacks, getChildrenView } from '../../../reference/selectors';

type FIXME_any = any;

const useConnect = ({ display, groups }) => {
  return useSelector((state) => ({
    groupStacks: getGroupStacks(state),
    groupChildren: getChildren(state, display, groups),
  }));
};

export interface ChartProps extends React.ComponentProps<'div'> {
  data: FIXME_any[];
  groups?: FIXME_any[];
  display: FIXME_any;
  amountSelector: (item: FIXME_any, serie: FIXME_any) => number;
}

const Chart: React.FC<ChartProps> = ({ data, groups, display, amountSelector, ...props }) => {
  const { groupStacks, groupChildren } = useConnect({ display, groups });
  const colors = useChartColors();

  if (!data.length || !groups) {
    return null;
  }

  const bars = createBars(groups, display, groupStacks, groupChildren, colors);

  return (
    <div {...props}>
      <AutoSizer>
        {({ height, width }) => (
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }} height={height} width={width} style={{ fontFamily: 'Roboto, sans-serif' }}>
            <XAxis dataKey={'period'} name="Date" />
            <YAxis name="Montant" />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {bars.map((serie) => (
              <Bar key={serie.index} stackId={serie.stackId} dataKey={(item) => amountSelector(item, serie)} name={serie.name} fill={serie.fill} />
            ))}
          </BarChart>
        )}
      </AutoSizer>
    </div>
  );
};

export default Chart;

function getChildren(state, display, groups) {
  if (!display.children || !groups) {
    return {};
  }

  const childrenView = getChildrenView(state);

  const result = {};
  for (const groupId of groups) {
    if (!groupId) {
      continue;
    }
    result[groupId] = childrenView[groupId].map((group) => group._id);
  }
  return result;
}

function createBars(groups, display, groupStacks, groupChildren, colors) {
  const bars = [];
  let index = 0;
  for (const groupId of groups) {
    bars.push(createBar(colors, display, groupStacks, groupId, groupId, index++, true));
    if (display.children && groupId) {
      for (const childId of groupChildren[groupId]) {
        bars.push(createBar(colors, display, groupStacks, groupId, childId, index++, false));
      }
    }
  }
  return bars;
}

function createBar(colors, display, groupStacks, stackId, groupId, index, root) {
  const path = groupStacks[groupId].map((group) => group.display);
  const name = display.fullnames ? path.join('/') : path[path.length - 1];
  return {
    index,
    stackId,
    group: groupId,
    name,
    fill: colors[index % colors.length],
    root,
  };
}
