import { HeadCell } from '@src/shared/interfaces';
import { gql } from "@apollo/client";

import { PermissionData } from "./interfaces";

export const GET_PERMISSIONS = gql`
  query getPermissions ($id: String!) {
    getPermissions(userId: $id) {
      id
      value
    }
  }
`;

// TODO: поменять тип
export const HEAD_CELLS: HeadCell<PermissionData>[] = [
  {
    id: 'value',
    numeric: false,
    disablePadding: false,
    label: 'Значение',
  },
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
];
