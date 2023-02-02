import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import { DocumentNode, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

export type Order = 'asc' | 'desc';

export function useTableControls<V extends { id: string }>(
  data: V[],
  initialOrderBy: keyof V,
  mutation: DocumentNode,
  queryToRefetch: string,
) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof V>(initialOrderBy);
  const [selected, setSelected] = useState<string[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const [deleteItems] = useMutation(mutation, {
    onCompleted: () => {
      toast('Данные удалены успешно', { type: 'success' });
      setSelected([]);
      setOpenConfirmation(false);
    },
    refetchQueries: [queryToRefetch],
  });

  const handleDeleteItems = useCallback(async () => {
    try {
      await deleteItems({
        variables: {
          ids: selected,
        },
      });
    } catch (e) {
      // @ts-ignore
      toast(`Произошла ошибка: ${e?.message ?? ''}`, {
        type: 'error',
      });
    }
  }, [deleteItems, selected]);

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof V) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map(({ id }) => id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event: MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleOpenCurtain = () => {
    setOpenConfirmation(true);
  };

  const handleCloseCurtain = () => {
    setOpenConfirmation(false);
  };

  return {
    selected,
    order,
    orderBy,
    isSelected,
    isDeleteCurtainOpen: openConfirmation,
    handleOpenDeleteCurtain: handleOpenCurtain,
    handleCloseDeleteCurtain: handleCloseCurtain,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleDeleteItems,
  };
}
