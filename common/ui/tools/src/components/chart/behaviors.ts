import * as colors from '@mui/material/colors';

const chartColors = createChartColors();

export const useChartColors = () => chartColors;

// https://materialuicolors.co/
function createChartColors() {
  const shade = 200;
  const hues: (keyof typeof colors)[] = [
    // easier to distinguish
    'red',
    'blue',
    'purple',
    'green',
    'teal',
    'amber',
    'orange',
    'brown',

    // harder to distinguish
    'pink',
    'deepPurple',
    'indigo',
    'lightBlue',
    'cyan',
    'lightGreen',
    'lime',
    'yellow',
    'deepOrange',
  ];
  return hues.map((hue) => colors[hue][shade] as string);
}
