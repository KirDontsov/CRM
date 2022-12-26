import './App.css';
import { gql, useQuery } from '@apollo/client';

const GET_USER = gql`
  query getUser($id: String!) {
    user(id: $id) {
      userId
      username
      email
    }
  }
`;

function App() {
  const { data } = useQuery(GET_USER, {
    variables: { id: '2d094c32-5003-45cc-a410-415584223546' },
  });

  console.log(data);

  return (
    <div className="App">
      <h1>Vite + React</h1>
    </div>
  );
}

export default App;
