import { ThemeProvider, createTheme } from '@mui/material';
import { FC, ReactNode } from 'react';

import {
  backColorMap,
  colorMap,
  Colors,
  BackColors,
  POPOVER_BACK_COLOR,
} from 'types';

export const MuiThemeProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: colorMap[Colors.BLUE],
      },
      secondary: {
        main: colorMap[Colors.PURPLE],
      },
      info: {
        main: colorMap[Colors.GREEN],
      },
      error: {
        main: colorMap[Colors.RED],
      },
      warning: {
        main: colorMap[Colors.ORANGE],
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: POPOVER_BACK_COLOR,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            backgroundColor: POPOVER_BACK_COLOR,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: backColorMap[BackColors.LIGHTER],
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            color: backColorMap[BackColors.LIGHTER],
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          deleteIcon: {
            color: backColorMap[BackColors.LIGHTER],
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          outlined: {
            backgroundColor: 'white',
          },
        },
      },
    },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
