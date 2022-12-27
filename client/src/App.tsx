import { AppPage } from './pages/AppPage';

// const GET_USER = gql`
//   query getUser($id: String!) {
//     user(id: $id) {
//       userId
//       username
//       email
//     }
//   }
// `;

export const App = () => {
  // useQuery(GET_USER, {
  //   variables: { id: '2d094c32-5003-45cc-a410-415584223546' },
  // });

  return <AppPage />;
};
