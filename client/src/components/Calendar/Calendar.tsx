import { FC, useCallback, useState } from 'react';
import { Paper, Button, Typography, IconButton } from '@mui/material';
import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import { DisplayDailyCalendar } from './DisplayDailyCalendar';

dayjs.locale('ru');

const DATE_FORMAT = 'MMMM - YYYY';

export interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

export const Calendar: FC<CalendarProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const onChevronClick = (direction: boolean) => {
    if (direction) {
      setSelectedMonth((prev) => dayjs(prev).subtract(1, 'month').toDate());
    } else {
      setSelectedMonth((prev) => dayjs(prev).add(1, 'month').toDate());
    }
  };

  const onDateClick = useCallback(
    (day: Date) => {
      setSelectedDate(day);
      onDateSelect(day);
    },
    [onDateSelect],
  );

  return (
    <div style={{ height: '100%' }}>
      <Paper
        style={{
          backgroundColor: 'rgba(0,0,0,0)',
          minHeight: '5%',
        }}
      >
        <IconButton onClick={() => onChevronClick(true)}>
          <ChevronLeftRounded />
        </IconButton>
        <Button>
          <Typography variant="h5">{dayjs(selectedMonth).format(DATE_FORMAT)}</Typography>
        </Button>
        <IconButton onClick={() => onChevronClick(false)}>
          <ChevronRightRounded />
        </IconButton>
      </Paper>
      <DisplayDailyCalendar selectedDate={selectedDate} selectedMonth={selectedMonth} onDateClick={onDateClick} />
    </div>
  );
};
