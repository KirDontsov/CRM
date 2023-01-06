import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme();
theme = responsiveFontSizes(theme);

theme.typography.h1 = {
  [theme.breakpoints.up('md')]: {
    fontSize: '1.4rem',
    fontWeight: '300',
  },
};

export const THEME = createTheme({
  ...theme,
  palette: {
    primary: {
      main: '#109CF1',
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
  },
});
