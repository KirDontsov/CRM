import { createTheme } from '@mui/material/styles';

export const THEME = createTheme({
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
        },
      },
    },
  },
});
