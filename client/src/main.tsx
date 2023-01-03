import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import { client } from './apollo-client';
import { AppContextProvider } from './context';
import { Layout } from './components/Layout';
import { THEME } from './constants';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

import './styles/styles.module.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/test',
        element: <div>test</div>,
      },
    ],
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

createRoot(document.getElementById('root') as HTMLElement).render(
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
