import { gql } from '@apollo/client';
import { ComboBoxOption } from '@components/FormComboBox';
import { WorkTypes, OrdersStatuses } from '@src/apollo-client';

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

export const STATUS_OPTIONS: ComboBoxOption[] = [
  { label: 'Открыт', value: OrdersStatuses.Open, id: OrdersStatuses.Open },
  { label: 'В Работе', value: OrdersStatuses.InProgress, id: OrdersStatuses.InProgress },
  { label: 'Требуются уточнения', value: OrdersStatuses.NeedInfo, id: OrdersStatuses.NeedInfo },
  { label: 'Приостановлен', value: OrdersStatuses.Paused, id: OrdersStatuses.Paused },
  { label: 'Ожидает выдачи', value: OrdersStatuses.WaitingForDelivery, id: OrdersStatuses.WaitingForDelivery },
  { label: 'Закрыт', value: OrdersStatuses.Done, id: OrdersStatuses.Done },
  { label: 'Отменен', value: OrdersStatuses.Cancelled, id: OrdersStatuses.Cancelled },
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

export const SAVE_ORDER = gql`
  mutation saveOrder($input: UpdateOrderInput!) {
    saveOrder(updateOrderInput: $input) {
      id
      orderName
      status
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

export const GET_ORDER = gql`
  query getOrderById($id: String!) {
    getOrder(id: $id) {
      id
      orderName
      status
      releaseDate
      createdAt
      initialComment
      sparePartsCost
      totalCost
      initialPhotos
      initialCost
      leftHeadlamp
      rightHeadlamp
      filials {
        id
        name
      }
    }
  }
`;
