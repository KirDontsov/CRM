export interface Data {
  id: string;
  username: string;
  email: string;
  roles: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}
