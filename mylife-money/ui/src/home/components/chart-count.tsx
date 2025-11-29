import { LineChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line } from 'recharts';
import { useChartColors } from 'mylife-tools';
import { useTotalByMonth } from '../views';

const ChartCount = (props) => {
  const data = useTotalByMonth();
  const [color] = useChartColors();

  return (
    <div {...props}>
      <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }} width={600} height={400} style={{ fontFamily: 'Roboto, sans-serif' }}>
        <XAxis dataKey="month" name="Mois" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke={color} name="Nombre d'opérations" />
      </LineChart>
    </div>
  );
};

export default ChartCount;
