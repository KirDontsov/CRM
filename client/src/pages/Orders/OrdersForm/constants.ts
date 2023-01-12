import { gql } from '@apollo/client';

import { ComboBoxOption } from '../../../components/FormComboBox';
import { WorkTypes } from '../../../apollo-client';

export const OPTIONS: ComboBoxOption[] = [
  { label: 'Замена стекла (НОВОЕ)', value: WorkTypes.GlassReplacementNew, id: WorkTypes.GlassReplacementNew },
  { label: 'Замена стекла (СТАРОЕ)', value: WorkTypes.GlassReplacementOld, id: WorkTypes.GlassReplacementOld },
  { label: 'Съемка/Установка стекла', value: WorkTypes.RIGlass, id: WorkTypes.RIGlass },
  { label: 'Ремонт корпуса', value: WorkTypes.CaseRepair, id: WorkTypes.CaseRepair },
  { label: 'Ремонт кронштейнов', value: WorkTypes.BracketsRepair, id: WorkTypes.BracketsRepair },
  { label: 'Полировка', value: WorkTypes.Polishing, id: WorkTypes.Polishing },
  { label: 'Покраска маски', value: WorkTypes.MaskPainting, id: WorkTypes.MaskPainting },
  { label: 'Замена линз', value: WorkTypes.LensReplacement, id: WorkTypes.LensReplacement },
];

export const CREATE_ORDER = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(createOrderInput: $input) {
      id
      orderName
      releaseDate
      initialComment
      sparePartsCost
      totalCost
      initialPhotos
      initialCost
      leftHeadlamp
      rightHeadlamp
    }
  }
`;
