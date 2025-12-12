import React from 'react';
import { AutoSizer } from 'react-virtualized';
import { BarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Bar } from 'recharts';
import { useChartColors } from 'mylife-tools';
import { Group, ReportGroupByPeriod, ReportingDisplay } from '../../../api';
import { getGroupStacks, getChildrenView } from '../../../reference/selectors';
import { AppState, useAppSelector } from '../../../store-api';

export interface Serie {
  index: number;
  stackId: string;
  group: string;
  name: string;
  fill: string;
  root: boolean;
}

export interface ChartDisplay extends ReportingDisplay {
  children?: boolean;
}

const useConnect = ({ display, groups }: { display: ChartDisplay; groups: string[] }) => {
  return useAppSelector((state) => ({
    groupStacks: getGroupStacks(state),
    groupChildren: getChildren(state, display, groups),
  }));
};

export type AmoutSelector = (item: ReportGroupByPeriod, serie: Serie) => number;

export interface ChartProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  data: ReportGroupByPeriod[];
  groups?: string[];
  display: ChartDisplay;
  amountSelector: AmoutSelector;
}

export default function Chart({ data, groups, display, amountSelector, ...props }: ChartProps) {
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
}

function getChildren(state: AppState, display: ChartDisplay, groups: string[]) {
  if (!display.children || !groups) {
    return {};
  }

  const childrenView = getChildrenView(state);

  const result: Record<string, string[]> = {};
  for (const groupId of groups) {
    if (!groupId) {
      continue;
    }
    result[groupId] = childrenView[groupId].map((group) => group._id);
  }
  return result;
}

function createBars(groups: string[], display: ChartDisplay, groupStacks: Record<string, Group[]>, groupChildren: Record<string, string[]>, colors: string[]): Serie[] {
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

function createBar(colors: string[], display: ChartDisplay, groupStacks: Record<string, Group[]>, stackId: string, groupId: string, index: number, root: boolean): Serie {
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
