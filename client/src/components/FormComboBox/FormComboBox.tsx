import { FC, SyntheticEvent, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useController } from 'react-hook-form';
import { Typography } from '@mui/material';

export interface ComboBoxProps {
  name: string;
  label: string;
  required?: boolean;
  options: ComboBoxOption[];
  multi?: boolean;
}

export interface ComboBoxOption {
  id: string;
  label: string;
  value: string;
}

export const FormComboBox: FC<ComboBoxProps> = ({ name, label, required = false, options, multi = false }) => {
  const {
    field: { onChange },
    fieldState: { error },
  } = useController({
    name,
    rules: required ? { required: 'Обязательное поле' } : undefined,
  });

  const handleChange = useCallback(
    (_: SyntheticEvent<Element, Event>, value: ComboBoxOption | null | ComboBoxOption[]) => {
      if (multi && Array.isArray(value)) {
        onChange(options.filter((option) => value?.includes(option)));
      } else if (!Array.isArray(value)) {
        onChange(options.find((option) => option.id === value?.id));
      }
    },
    [multi, onChange, options],
  );

  return (
    <>
      <Autocomplete
        {...(multi ? { multiple: true } : {})}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disablePortal
        options={options}
        renderInput={(params) => <TextField {...params} variant="standard" label={label} />}
      />
      {!!error && <Typography color="#F7685B">{error.message}</Typography>}
    </>
  );
};
