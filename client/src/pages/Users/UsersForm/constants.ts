import { gql } from '@apollo/client';
import { ComboBoxOption } from '@components/FormComboBox';
import { UserRoles } from '@src/apollo-client';

export const OPTIONS: ComboBoxOption[] = [
  { label: 'Админ', value: UserRoles.Admin, id: UserRoles.Admin },
  { label: 'Менеджер', value: UserRoles.Reader, id: UserRoles.Reader },
];

export const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
      username
      email
      roles
    }
  }
`;
