import { OrdersStatuses, WorkTypes } from '@apollo-client';

export interface OrdersData {
  id: string;

  orderName: string;

  status: OrdersStatuses;

  initialPhotos: string;

  initialCost: string;

  leftHeadlamp: WorkTypes[];

  rightHeadlamp: WorkTypes[];

  workType: [string];

  releaseDate: string;

  initialComment: string;

  sparePartsCost: string;

  totalCost: string;

  createdAt: string;

  updatedAt: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof OrdersData;
  label: string;
  numeric: boolean;
}
