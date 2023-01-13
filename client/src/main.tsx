import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { MuiThemeProvider } from '@components/MuiThemeProvider';
import { Register } from '@pages/Register';
import { Login } from '@pages/Login';
import { Dashboard } from '@pages/Dashboard';
import { Users } from '@pages/Users';
import { Settings } from '@pages/Settings';
import { Orders } from '@pages/Orders';
import { Events } from '@pages/Events';
import { Event } from '@pages/Event';
import { AppContextProvider } from '@context';
import { GenericApolloProvider } from '@apollo-client';

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
        path: '/events',
        element: <Events />,
      },
      {
        path: 'events/:eventId',
        element: <Event />,
      },
      {
        path: '/orders',
        element: <Orders />,
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: <Settings />,
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
    <GenericApolloProvider>
      <AppContextProvider>
        <MuiThemeProvider>
          <RouterProvider router={router} />
        </MuiThemeProvider>
      </AppContextProvider>
    </GenericApolloProvider>
  </React.StrictMode>,
);
