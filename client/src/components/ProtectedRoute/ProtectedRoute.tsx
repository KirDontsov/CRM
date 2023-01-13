import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '@context';
import { UserRoles } from '@apollo-client';

export interface ProtectedRouteProps {
  children: ReactNode;
}
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const userRoles = useContextSelector(AppContext, (ctx) => ctx.state.userRoles);

  if (userRoles !== UserRoles.Admin) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
