import { FC, ReactNode, useMemo } from 'react';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import { useContextSelector } from 'use-context-selector';

import { AppContext } from '../../context';

export interface MuiThemeProviderProps {
  children?: ReactNode | ReactNode[];
}

let theme = createTheme();
theme = responsiveFontSizes(theme);

theme.typography.h1 = {
  [theme.breakpoints.up('md')]: {
    fontSize: '1.4rem',
    fontWeight: '300',
  },
};

export const MuiThemeProvider: FC<MuiThemeProviderProps> = ({ children }) => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);

  const THEME = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#885AF8' : '#109CF1',
            contrastText: '#fff',
          },
        },
        components: {
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '20px 24px',
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                padding: '9.25px 34px',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                height: '56px',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: '6px 0 18px rgba(0, 0, 0, 0.06)',
              },
            },
          },
          MuiLink: {
            styleOverrides: {
              root: {
                color: darkMode ? '#fff' : '#90A0B7',
                ':hover': darkMode ? '#885AF8' : '#90A0B7',
              },
            },
          },
        },
      }),
    [darkMode],
  );

  return <ThemeProvider theme={THEME}>{children}</ThemeProvider>;
};
