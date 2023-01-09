import { Button, Card, CardActionArea, CardContent, Paper, Typography } from '@mui/material';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { Formatter } from 'recharts/types/component/DefaultTooltipContent';
import { useContextSelector } from 'use-context-selector';
import { useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { AppContext } from '../../context';

import styles from './styles.module.scss';
import { CHART_DATA, GET_EVENTS } from './constants';
import { EventsData } from './interfaces';

export const Dashboard = () => {
  const navigate = useNavigate();
  const collapsed = useContextSelector(AppContext, (ctx) => ctx.state.collapsed);

  const { data, loading } = useQuery(GET_EVENTS);
  const events: EventsData[] = data?.events ?? [];

  const handleFormatLabel = (value: string, name: string) => {
    if (name === 'pv') {
      return [value, 'Прибыль'];
    }
    if (name === 'uv') {
      return [value, 'Выручка'];
    }
    return [value, name];
  };

  const handleEventClick = useCallback(
    (eventId: string) => {
      navigate(`/events/${eventId}`);
    },
    [navigate],
  );

  return (
    <div
      className={styles.dashboardContainer}
      style={{ width: collapsed ? 'calc(100% - 12px)' : 'calc(100% - 159px)' }}
    >
      <Paper elevation={2} className={styles.dashboardLeftPart}>
        <Typography variant="h1">События</Typography>
        <div className={styles.eventCardsContainer}>
          {!loading &&
            events
              ?.slice()
              ?.sort((a, b) => {
                const aD = dayjs(a.targetDate).toISOString();
                const bD = dayjs(b.targetDate).toISOString();
                return aD.localeCompare(bD);
              })
              ?.map((ev) => (
                <div key={ev.id} className={styles.eventCard}>
                  <CardActionArea onClick={() => handleEventClick(ev.id)}>
                    <Card elevation={24}>
                      <CardContent className={styles.eventCardContainer}>
                        <div className={styles.eventCardContent}>
                          <div className={styles.eventCardHeader}>
                            <Typography component="h3" variant="h6">
                              {ev.eventName}
                            </Typography>
                            <Button
                              color={ev.eventType === 'Звонок' ? 'success' : 'error'}
                              size="small"
                              variant="contained"
                            >
                              {ev.eventType}
                            </Button>
                          </div>
                          <Typography component="p">{`Дата: ${dayjs(ev.targetDate).format('DD.MM.YYYY')}`}</Typography>
                          <Typography component="p">{ev.eventComment}</Typography>
                        </div>
                      </CardContent>
                    </Card>
                  </CardActionArea>
                </div>
              ))}
        </div>
      </Paper>
      <Paper elevation={2} className={styles.dashboardRightPart}>
        <div className={styles.earningsWidget}>
          <Typography variant="h1">Выручка</Typography>
          <AreaChart
            width={600}
            height={350}
            data={CHART_DATA}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tick={false} />
            <Tooltip formatter={handleFormatLabel as unknown as Formatter<string, string>} />
            <Area type="monotone" dataKey="pv" label="Прибыль" stackId="1" stroke="#2ED47A" fill="#2ED47A" />
            <Area type="monotone" dataKey="uv" label="Выручка" stackId="1" stroke="#885AF8" fill="#885AF8" />
          </AreaChart>
        </div>
      </Paper>
    </div>
  );
};
