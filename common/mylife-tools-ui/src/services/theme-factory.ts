import { colors, createTheme, responsiveFontSizes, ThemeOptions } from '@material-ui/core';
import { useScreenPhone } from '../components/behaviors/responsive';

const base: ThemeOptions = {
  palette: {
    primary: colors.blue,
    secondary: colors.pink,
  }
}

const dense: ThemeOptions = {
  typography: {
    fontSize: 12
  },

  spacing: 2,

  props: {
    MuiButton: {
      size: 'small',
    },
    MuiFilledInput: {
      margin: 'dense',
    },
    MuiFormControl: {
      margin: 'dense',
    },
    MuiFormHelperText: {
      margin: 'dense',
    },
    MuiIconButton: {
      size: 'small',
    },
    MuiInputBase: {
      margin: 'dense',
    },
    MuiInputLabel: {
      margin: 'dense',
    },
    MuiListItem: {
      // dense: true,
    },
    MuiOutlinedInput: {
      margin: 'dense',
    },
    MuiFab: {
      size: 'small',
    },
    MuiTable: {
      size: 'small',
    },
    MuiTextField: {
      margin: 'dense',
    },
    MuiToolbar: {
      variant: 'dense',
    },
  },

  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          overflow: 'hidden',
        },
      },
    },

    MuiIconButton: {
      sizeSmall: {
        // Adjust spacing to reach minimal touch target hitbox
        marginLeft: 4,
        marginRight: 4,
        padding: 4,
      },
    },

    MuiTooltip: {
      tooltip: {
        fontSize: "0.6rem",
      }
    },
  },
};

const defaultTheme = responsiveFontSizes(createTheme({ ... base }));
const phoneTheme = responsiveFontSizes(createTheme({ ... base, ...dense }));

export function useTheme() {
  const isPhone = useScreenPhone();
  return isPhone ? phoneTheme : defaultTheme;
}