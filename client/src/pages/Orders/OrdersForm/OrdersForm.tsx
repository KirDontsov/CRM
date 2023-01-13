import { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { FormComboBox, ComboBoxOption } from '@components/FormComboBox';
import { FormInput } from '@components/FormInput';

import { CREATE_ORDER, GET_ORDER, OPTIONS, SAVE_ORDER, STATUS_OPTIONS } from './constants';
import styles from './styles.module.scss';

type Inputs = {
  orderName: string;
  status?: ComboBoxOption;
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
  selected: string;
  onClose: () => void;
}

export const DEFAULT_VALUES = {
  orderName: '',
  status: STATUS_OPTIONS[0],
  initialComment: '',
  initialPhotos: '',
  leftHeadlamp: [],
  rightHeadlamp: [],
  sparePartsCost: '',
};

export const OrdersForm: FC<OrdersFormProps> = memo(({ selected, onClose }) => {
  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      // TODO: показать тост успех
      onClose();
    },
    refetchQueries: ['getOrders'],
  });

  const [saveOrder] = useMutation(SAVE_ORDER, {
    onCompleted: () => {
      // TODO: показать тост успех
      onClose();
    },
    refetchQueries: ['getOrders'],
  });

  const { data, loading } = useQuery(GET_ORDER, {
    variables: {
      id: selected,
    },
    skip: !selected || selected === 'new',
  });

  const defaultValues = useMemo(
    () =>
      selected && selected !== 'new' && !loading
        ? {
            orderName: data?.getOrder?.orderName,
            status: STATUS_OPTIONS.find(({ id }) => id === data?.getOrder?.status),
            initialCost: data?.getOrder?.initialCost,
            sparePartsCost: data?.getOrder?.sparePartsCost,
            initialPhotos: data?.getOrder?.initialPhotos,
            leftHeadlamp: OPTIONS.filter(({ id }) => data?.getOrder?.leftHeadlamp?.includes(id)) ?? [],
            rightHeadlamp: OPTIONS.filter(({ id }) => data?.getOrder?.rightHeadlamp?.includes(id)) ?? [],
            initialComment: data?.getOrder?.initialComment,
          }
        : DEFAULT_VALUES,
    [data?.getOrder, loading, selected],
  );

  const form = useForm<Inputs>({ defaultValues });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({
      orderName,
      status,
      initialComment,
      initialCost,
      initialPhotos,
      leftHeadlamp,
      rightHeadlamp,
      sparePartsCost,
    }) => {
      if (selected && selected !== 'new') {
        await saveOrder({
          variables: {
            input: {
              id: selected,
              orderName,
              status: status?.id,
              initialComment: initialComment || null,
              initialCost,
              initialPhotos: initialPhotos || null,
              leftHeadlamp: leftHeadlamp?.map(({ value }) => value) ?? [],
              rightHeadlamp: rightHeadlamp?.map(({ value }) => value) ?? [],
              sparePartsCost: sparePartsCost || null,
            },
          },
        });
      } else {
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
      }
    },
    [createOrder, saveOrder, selected],
  );

  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(handleReset, [handleReset]);

  return (
    <div className={styles.ordersFormContent}>
      <Typography variant="h1" className={styles.heading}>
        {selected && selected !== 'new' ? 'Изменение заказа' : 'Создание нового заказа'}
      </Typography>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} paddingBottom={2}>
            <FormInput name="orderName" label="Наименование заказа" required />
            <FormInput name="initialCost" label="Стоимость" required />
            <FormInput name="sparePartsCost" label="Стоимость запчастей" required />
            <FormInput name="initialPhotos" label="Ссылка на фото" />

            <FormComboBox multi name="leftHeadlamp" label="Работы по левой фаре" options={OPTIONS} />
            <FormComboBox multi name="rightHeadlamp" label="Работы по правой фаре" options={OPTIONS} />

            <FormComboBox name="status" label="Статус заказа" options={STATUS_OPTIONS} />

            <FormInput name="initialComment" label="Комментарий" multi />
          </Stack>
          <div className={styles.bottom}>
            <Button type="submit" variant="contained">
              {selected && selected !== 'new' ? 'Сохранить изменения' : 'Создать новый заказ'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
});
