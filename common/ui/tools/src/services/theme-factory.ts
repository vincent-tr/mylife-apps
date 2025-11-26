import * as colors from '@mui/material/colors';
import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material/styles';
import { useScreenPhone } from '../components/behaviors/responsive';

const base: ThemeOptions = {
  palette: {
    primary: colors.blue,
    secondary: colors.pink,
  },
};

const dense: ThemeOptions = {
  typography: {
    fontSize: 12,
  },

  spacing: 2,

  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'dense',
      },
    },
  },
};

const defaultTheme = responsiveFontSizes(createTheme({ ...base }));
const phoneTheme = responsiveFontSizes(createTheme({ ...base, ...dense }));

export function useTheme() {
  const isPhone = useScreenPhone();
  return isPhone ? phoneTheme : defaultTheme;
}
