'use strict';

import React from 'react';
import * as chart from '@latticejs/mui-recharts';
import { useChartColors } from 'mylife-tools-ui';
import { useTotalByMonth } from '../views';
import { colors as muiColors } from '@material-ui/core';

const ChartAmount = (props) => {
  const { sorted: data } = useTotalByMonth();
  const chartColors = useChartColors();

  const colors = {
    debit: muiColors.red[200],
    credit: muiColors.green[200],
    balance: chartColors[1],
  };

  return (
    <div {...props}>
      <chart.LineChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}} width={600} height={400}>
        <chart.XAxis dataKey='month' name='Mois' />
        <chart.YAxis />
        <chart.CartesianGrid strokeDasharray='3 3'/>
        <chart.Tooltip/>
        <chart.Legend />
        <chart.Line type='monotone' dataKey='sumCredit' stroke={colors.credit} name='Crédit' />
        <chart.Line type='monotone' dataKey='sumDebit' stroke={colors.debit} name='Débit' />
        <chart.Line type='monotone' dataKey='balance' stroke={colors.balance} name='Total' />
      </chart.LineChart>
    </div>
  );
};

export default ChartAmount;
