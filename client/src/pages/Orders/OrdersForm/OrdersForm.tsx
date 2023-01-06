import { FC, useCallback } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';

import { FormComboBox, ComboBoxOption } from '../../../components/FormComboBox';
import { FormInput } from '../../../components/FormInput';

import { CREATE_ORDER, OPTIONS } from './constants';
import styles from './styles.module.scss';

type Inputs = {
  orderName: string;
  releaseDate: string;
  initialComment: string;
  sparePartsCost: string;
  totalCost: string;
  leftHeadlamp: ComboBoxOption[];
  rightHeadlamp: ComboBoxOption[];
  initialPhotos: string;
  initialCost: string;
};

export interface OrdersFormProps {
  onClose: () => void;
}

export const OrdersForm: FC<OrdersFormProps> = ({ onClose }) => {
  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      // TODO: показать тост успех
      onClose();
    },
    refetchQueries: ['getOrders'],
  });

  const form = useForm<Inputs>();

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ orderName, initialComment, initialCost, initialPhotos, leftHeadlamp, rightHeadlamp, sparePartsCost }) => {
      await createOrder({
        variables: {
          input: {
            orderName,
            initialComment: initialComment || null,
            initialCost,
            initialPhotos: initialPhotos || null,
            leftHeadlamp: leftHeadlamp?.map(({ value }) => value) ?? [],
            rightHeadlamp: rightHeadlamp?.map(({ value }) => value) ?? [],
            sparePartsCost: sparePartsCost || null,
          },
        },
      });
    },
    [createOrder],
  );

  return (
    <div className={styles.ordersFormContent}>
      <Typography variant="h1" className={styles.heading}>
        Создание нового заказа
      </Typography>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} paddingBottom={2}>
            <FormInput name="orderName" label="Наименование заказа" required />
            <FormInput name="initialCost" label="Стоимость" required />
            <FormInput name="sparePartsCost" label="Стоимость запчастей" required />
            <FormInput name="initialPhotos" label="Ссылка на фото" />
            <FormInput name="initialComment" label="Комментарий" />

            <FormComboBox multi name="leftHeadlamp" label="Работы по левой фаре" options={OPTIONS} />
            <FormComboBox multi name="rightHeadlamp" label="Работы по правой фаре" options={OPTIONS} />
          </Stack>
          <div className={styles.bottom}>
            <Button type="submit" variant="contained">
              Создать новый заказ
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
