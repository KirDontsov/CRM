import { FC, ReactNode } from 'react';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';
import { localStorageAppPrefix } from '@context';

const httpLink = createHttpLink({
  uri: 'http://localhost:8081/graphql',
  // для jest тестов
  fetch,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(`${localStorageAppPrefix}.token`);

  return {
    headers: {
      ...headers,
      filialIds: `${localStorage.getItem(`${localStorageAppPrefix}.filialIds`) ?? ''}`,
      userId: `${localStorage.getItem(`${localStorageAppPrefix}.userId`) ?? ''}`,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export interface ApolloProviderProps {
  children: ReactNode | ReactNode[];
}

export const GenericApolloProvider: FC<ApolloProviderProps> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
