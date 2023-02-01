export interface HeadCell<V> {
  disablePadding: boolean;
  id: keyof V;
  label: string;
  numeric: boolean;
}
