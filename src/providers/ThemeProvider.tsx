import { ThemeProvider, createTheme } from '@mui/material';
import { FC } from 'react';

import { POPOVER_BACK_COLOR } from 'components';
import { backColorMap, colorMap, Colors, BackColors } from 'types';

export const MuiThemeProvider: FC<{
  children: React.ReactNode;
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
            color: backColorMap[BackColors.DARKER],
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            color: backColorMap[BackColors.DARKER],
          },
        },
      },
    },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
