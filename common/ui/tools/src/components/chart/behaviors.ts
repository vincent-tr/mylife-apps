import * as colors from '@mui/material/colors';

const chartColors = createChartColors();

export const useChartColors = () => chartColors;

interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  A100: string;
  A200: string;
  A400: string;
  A700: string;
}

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
  return hues.map((hue: keyof typeof colors) => (colors[hue] as ColorShades)[shade] as string);
}
