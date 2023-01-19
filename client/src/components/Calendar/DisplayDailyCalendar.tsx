import { FC, memo } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import dayjs from 'dayjs';
import { useContextSelector } from 'use-context-selector';
import { EventsData } from '@pages/Dashboard/interfaces';
import { AppContext } from '@context';

import styles from './styles.module.scss';

const today = new Date();
const DAY_FORMAT = 'D';
const weekdays = [
  { id: 0, day: 'Пн' },
  { id: 1, day: 'Вт' },
  { id: 2, day: 'Ср' },
  { id: 3, day: 'Чт' },
  { id: 4, day: 'Пт' },
  { id: 5, day: 'Сб' },
  { id: 6, day: 'Вс' },
];

export interface DisplayDailyCalendarProps {
  loading: boolean;
  events: EventsData[];
  selectedMonth: Date;
  selectedDate: Date;
  onDateClick: (day: Date) => void;
}

export const DisplayDailyCalendar: FC<DisplayDailyCalendarProps> = memo(
  ({ selectedMonth, selectedDate, onDateClick, events, loading }) => {
    const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);

    const monthStart = dayjs(selectedMonth).startOf('month').toDate();
    const monthEnd = dayjs(selectedMonth).endOf('month').toDate();
    const startDate = dayjs(monthStart).startOf('week').toDate();
    const endDate = dayjs(monthEnd).endOf('week').toDate();

    const eachWeek = [];
    let daysOfWeek = [];

    let day = dayjs(startDate).toDate();
    const end = endDate;
    let formattedDate;

    let weekNumber = 1;
    while (day <= end) {
      for (let i = 0; i < 7; i += 1) {
        formattedDate = dayjs(day).format(DAY_FORMAT);
        const cloneDay = day;
        const eventsThatDay = events.filter((event) => dayjs(event.targetDate.split('T')[0]).isSame(cloneDay), 'd');

        daysOfWeek.push(
          <TableCell key={formattedDate} padding="none" size="small">
            <CardActionArea onClick={() => onDateClick(cloneDay)} style={{ height: '100%' }}>
              <Card
                style={
                  dayjs(day).isSame(selectedDate, 'd')
                    ? {
                        backgroundColor: 'rgba(128,128,128,0.5)',
                        height: '100%',
                      }
                    : {
                        backgroundColor: 'rgba(0,0,0,0)',
                        height: '100%',
                      }
                }
              >
                <CardContent style={{ height: '100%' }}>
                  <div className={styles.cardContent}>
                    <div className={styles.eventsContainer}>
                      {!loading &&
                        eventsThatDay.map((ev) => (
                          <div
                            key={ev.id}
                            className={styles.event}
                            style={{
                              backgroundColor: `${
                                darkMode
                                  ? `${dayjs().isAfter(cloneDay) ? '#C2CFE0' : '#885AF8'}`
                                  : `${dayjs().isAfter(cloneDay) ? '#C2CFE0' : '#109CF1'}`
                              }`,
                            }}
                          />
                        ))}
                    </div>
                    <div className={styles.textContainer}>
                      {dayjs(day).isSame(today, 'd') ? (
                        <Typography color="primary" style={{ fontSize: '22px', fontWeight: '500' }}>
                          {formattedDate}
                        </Typography>
                      ) : (
                        <Typography style={!dayjs(day).isSame(today, 'm') ? { color: 'rgba(128,128,128,1)' } : {}}>
                          {formattedDate}
                        </Typography>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardActionArea>
          </TableCell>,
        );

        day = dayjs(day).add(1, 'day').toDate();
      }

      eachWeek.push(<TableRow key={weekNumber}>{daysOfWeek}</TableRow>);
      daysOfWeek = [];
      weekNumber += 1;
    }

    return (
      <Table style={{ height: '90%' }}>
        <TableHead>
          <TableRow>
            {weekdays.map(({ id, day: dayOfWeek }) => (
              <TableCell key={id} size="small">
                <Typography align="center">{dayOfWeek}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{eachWeek}</TableBody>
      </Table>
    );
  },
);
