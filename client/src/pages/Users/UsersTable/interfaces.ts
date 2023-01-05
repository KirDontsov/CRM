export interface Data {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}
