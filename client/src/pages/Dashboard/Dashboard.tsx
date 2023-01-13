import { useCallback, useState, MouseEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardActionArea, CardContent, Paper, Typography } from '@mui/material';
import { Area, AreaChart, CartesianGrid, Cell, Pie, Tooltip, XAxis, YAxis, PieChart, Sector } from 'recharts';
import { Formatter } from 'recharts/types/component/DefaultTooltipContent';
import { useContextSelector } from 'use-context-selector';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import SquareIcon from '@mui/icons-material/Square';
import { AppContext } from '@context';
import { GET_ORDERS } from '@pages/Orders/OrdersTable/constants';
import { OrdersStatuses } from '@apollo-client';
import { OrdersData } from '@pages/Orders/OrdersTable/interfaces';

import styles from './styles.module.scss';
import { CHART_DATA, GET_EVENTS } from './constants';
import { EventsData } from './interfaces';

const COLORS = ['#109CF1', '#2ED47A', '#885AF8', '#F7685B', '#ff0'];
const RADIAN = Math.PI / 180;

export const Dashboard = () => {
  const navigate = useNavigate();
  const collapsed = useContextSelector(AppContext, (ctx) => ctx.state.collapsed);
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);

  const { data, loading } = useQuery(GET_EVENTS, {
    variables: {
      userId,
    },
  });
  const events: EventsData[] = data?.getEventsByUserId ?? [];

  const { data: ordersData } = useQuery(GET_ORDERS, {
    variables: {
      userId,
    },
  });

  const pieChartData = useMemo(
    () => [
      {
        name: 'В работе',
        value: (ordersData?.getOrders?.filter(({ status }: OrdersData) => status === OrdersStatuses.InProgress) ?? [])
          ?.length,
      },
      {
        name: 'Закрытые',
        value: (ordersData?.getOrders?.filter(({ status }: OrdersData) => status === OrdersStatuses.Done) ?? [])
          ?.length,
      },
      {
        name: 'Отмененые',
        value: (ordersData?.getOrders?.filter(({ status }: OrdersData) => status === OrdersStatuses.Cancelled) ?? [])
          ?.length,
      },
      {
        name: 'Новые',
        value: (ordersData?.getOrders?.filter(({ status }: OrdersData) => status === OrdersStatuses.Open) ?? [])
          ?.length,
      },
    ],
    [ordersData],
  );

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

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: MouseEvent, index: number) => {
    setActiveIndex(index);
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={darkMode ? '#fff' : '#333'}>
          {`${value}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`${(percent * 100).toFixed(2)}%`}
        </text>
      </g>
    );
  };

  return (
    <div
      className={styles.dashboardContainer}
      style={{ width: collapsed ? 'calc(100% - 33px)' : 'calc(100% - 180px)' }}
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
      <div className={styles.dashboardRightPart}>
        <Paper elevation={2} className={styles.widget}>
          <Typography variant="h1">Заказы</Typography>
          <div className={styles.pieContainer}>
            <PieChart width={400} height={400}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <div className={styles.pieStat}>
              {pieChartData.map((entry, index) => (
                <div key={entry.name} style={{ color: COLORS[index] }} className={styles.pieStatItem}>
                  <SquareIcon />
                  <Typography component="p" color={darkMode ? '#fff' : 'initial'}>{`${entry.name}`}</Typography>
                </div>
              ))}
            </div>
          </div>
        </Paper>

        <Paper
          // пока только моки
          elevation={2}
          className={styles.widget}
        >
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
        </Paper>
      </div>
    </div>
  );
};
