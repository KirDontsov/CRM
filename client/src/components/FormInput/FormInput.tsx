import { TextField, Typography } from '@mui/material';
import { useController } from 'react-hook-form';
import { FC } from 'react';

export interface FromInputProps {
  name: string;
  label: string;
  required?: boolean;
}
export const FormInput: FC<FromInputProps> = ({ name, label, required = false }) => {
  const {
    field: { onChange },
    fieldState: { error },
  } = useController({
    name,
    rules: required ? { required: 'Обязательное поле' } : undefined,
  });

  return (
    <>
      <TextField variant="standard" label={label} onChange={onChange} />
      {!!error && <Typography color="#F7685B">{error.message}</Typography>}
    </>
  );
};
