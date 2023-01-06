import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { localStorageAppPrefix } from '../context/constants';

const httpLink = createHttpLink({
  uri: 'http://localhost:8081/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(`${localStorageAppPrefix}.token`);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export { WorkTypes, UserRoles } from './types';
