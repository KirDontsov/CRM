import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import { App } from './App';
import { client } from './apollo-client';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { AppContextProvider } from './context';
import { THEME } from './constants';

import './styles.module.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={THEME}>
      <ApolloProvider client={client}>
        <AppContextProvider>
          <RouterProvider router={router} />
        </AppContextProvider>
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
