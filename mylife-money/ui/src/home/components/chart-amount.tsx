import * as muiColors from '@mui/material/colors';
import { LineChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line } from 'recharts';
import { useChartColors } from 'mylife-tools';
import { useTotalByMonthView } from '../views';

export type ChartAmountProps = Omit<React.ComponentProps<'div'>, 'children'>;

export default function ChartAmount(props: ChartAmountProps) {
  const data = useTotalByMonthView();
  const chartColors = useChartColors();

  const colors = {
    debit: muiColors.red[200],
    credit: muiColors.green[200],
    balance: chartColors[1],
  };

  return (
    <div {...props}>
      <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }} width={600} height={400} style={{ fontFamily: 'Roboto, sans-serif' }}>
        <XAxis dataKey="month" name="Mois" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sumCredit" stroke={colors.credit} name="Crédit" />
        <Line type="monotone" dataKey="sumDebit" stroke={colors.debit} name="Débit" />
        <Line type="monotone" dataKey="balance" stroke={colors.balance} name="Total" />
      </LineChart>
    </div>
  );
}
