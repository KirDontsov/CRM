import { WorkTypes } from '../../../apollo-client';

export interface Data {
  id: string;

  orderName: string;

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
  id: keyof Data;
  label: string;
  numeric: boolean;
}
