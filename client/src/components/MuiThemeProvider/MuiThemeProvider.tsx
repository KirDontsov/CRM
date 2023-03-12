import { FC, ReactNode, useMemo } from 'react';
import { useContextSelector } from 'use-context-selector';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import { AppContext } from '@context';

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
          success: {
            main: '#2ED47A',
            contrastText: '#fff',
          },
          error: {
            main: '#F7685B',
            contrastText: '#fff',
          },
          secondary: {
            main: darkMode ? '#885AF8' : '#334D6E',
          },
          background: {
            default: darkMode ? '#242526' : '#fff',
            paper: darkMode ? '#242526' : '#fff',
          },
        },
        components: {
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '20px 24px',
              },
              sizeMedium: {
                padding: '20px 24px',
              },
              sizeSmall: {
                padding: '2px',
                height: '100px',
                border: 'none',
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
          MuiCard: {
            styleOverrides: {
              root: {
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              },
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                height: '56px',
              },
              sizeSmall: {
                height: '24px',
              },
              containedSuccess: {
                backgroundColor: '#2ED47A',
                color: '#fff',
              },
              containedError: {
                backgroundColor: '#F7685B',
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
