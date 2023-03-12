import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardActionArea, CardContent, Paper, Typography } from '@mui/material';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { Formatter } from 'recharts/types/component/DefaultTooltipContent';
import { useContextSelector } from 'use-context-selector';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { AppContext } from '@context';
import { UserRoles } from '@apollo-client';
import { PAGING } from '@shared';
import produce from 'immer';
import { FetchMoreObserver } from '@components/FetchMoreObserver';
import { OrdersAnalytics } from '@pages/Dashboard/OrdersAnalytics';

import styles from './styles.module.scss';
import { CHART_DATA, GET_EVENTS } from './constants';
import { EventsData } from './interfaces';

export const Dashboard = () => {
  const navigate = useNavigate();
  const userRoles = useContextSelector(AppContext, (ctx) => ctx.state.userRoles);

  const { data, fetchMore, loading } = useQuery(GET_EVENTS, {
    variables: {
      limit: PAGING.limit,
      offset: PAGING.offset,
    },
  });
  const { events, eventsCount }: { events: EventsData[]; eventsCount: number } = useMemo(
    () => ({ events: data?.getEventsByUserId ?? [], eventsCount: data?.countEvents ?? [] }),
    [data],
  );

  const handleFetchMore = useCallback(async () => {
    if (loading) return false;
    await fetchMore({
      variables: { limit: PAGING.limit, offset: events.length || PAGING.offset },
      updateQuery: (prev, { fetchMoreResult }) =>
        produce(prev, (result: { getEventsByUserId: EventsData[] }) => {
          result?.getEventsByUserId?.push(...(fetchMoreResult?.getEventsByUserId || []));
        }),
    });
    return events.length >= eventsCount;
  }, [loading, fetchMore, events, eventsCount]);

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
    <div className={styles.dashboardContainer}>
      <Paper elevation={2} className={styles.dashboardLeftPart}>
        <Typography variant="h1">События</Typography>
        <div className={styles.eventCardsContainer}>
          {Boolean(events.length) &&
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
          <FetchMoreObserver
            fetchMore={handleFetchMore}
            fetchMoreLoading={loading}
            itemsLength={events.length}
            totalCount={eventsCount}
          />
        </div>
      </Paper>
      <div className={styles.dashboardRightPart}>
        <Paper elevation={2} className={styles.widget}>
          <Typography variant="h1">Заказы</Typography>
          <OrdersAnalytics />
        </Paper>
        {userRoles === UserRoles.Admin && (
          <Paper
            // пока только моки
            elevation={2}
            className={styles.widget}
          >
            <Typography variant="h1">Выручка</Typography>
            <AreaChart
              width={500}
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
          </Paper>
        )}
      </div>
    </div>
  );
};
