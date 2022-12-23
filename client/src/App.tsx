import './App.css';
import { gql, useQuery } from '@apollo/client';

const GET_USER = gql`
  query getUser($username: String!) {
    user(username: $username) {
      id
      username
    }
  }
`;

function App() {
  const { data } = useQuery(GET_USER, {
    variables: { username: 'admin' },
  });

  console.log(data);

  return (
    <div className="App">
      <h1>Vite + React</h1>
    </div>
  );
}

export default App;
