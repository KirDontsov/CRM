import { Cell, Pie, PieChart, Sector } from 'recharts';
import SquareIcon from '@mui/icons-material/Square';
import { Typography } from '@mui/material';
import { MouseEvent, useMemo, useState } from 'react';
import { OrdersData } from '@pages/Orders/OrdersTable/interfaces';
import { OrdersStatuses } from '@apollo-client';
import { useQuery } from '@apollo/client';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '@context';

import styles from '../styles.module.scss';

import { COUNT_ORDERS_BY_MASTER, GET_ORDERS_BY_MASTER } from './constants';

const COLORS = ['#109CF1', '#2ED47A', '#F7685B', '#C2CFE0'];
const RADIAN = Math.PI / 180;

export const OrdersAnalytics = () => {
  const darkMode = useContextSelector(AppContext, (ctx) => ctx.state.darkMode);
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);

  const { data: ordersData } = useQuery(GET_ORDERS_BY_MASTER, {
    variables: {
      masterIds: [userId],
      offset: 0,
      limit: 100,
    },
  });

  const { data: ordersByMasterData } = useQuery(COUNT_ORDERS_BY_MASTER, {
    variables: {
      masterIds: [userId],
    },
  });
  const countOrdersByMaster = ordersByMasterData?.countOrdersByMasterId ?? 0;

  const pieChartData = useMemo(
    () => [
      {
        name: 'В работе',
        value: (
          ordersData?.getOrdersByMasterId?.filter(({ status }: OrdersData) => status === OrdersStatuses.InProgress) ??
          []
        )?.length,
      },
      {
        name: 'Закрытые',
        value: (
          ordersData?.getOrdersByMasterId?.filter(({ status }: OrdersData) => status === OrdersStatuses.Done) ?? []
        )?.length,
      },
      {
        name: 'Отмененые',
        value: (
          ordersData?.getOrdersByMasterId?.filter(({ status }: OrdersData) => status === OrdersStatuses.Cancelled) ?? []
        )?.length,
      },
      {
        name: 'Новые',
        value: (
          ordersData?.getOrdersByMasterId?.filter(({ status }: OrdersData) => status === OrdersStatuses.Open) ?? []
        )?.length,
      },
    ],
    [ordersData],
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
          {`${(percent * 100).toFixed()}%`}
        </text>
      </g>
    );
  };
  return (
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
        <div>{`Заказов у текущего пользователя: ${countOrdersByMaster}`}</div>
        {pieChartData.map((entry, index) => (
          <div key={entry.name} style={{ color: COLORS[index] }} className={styles.pieStatItem}>
            <SquareIcon />
            <Typography component="p" color={darkMode ? '#fff' : 'initial'}>{`${entry.name}`}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
};
