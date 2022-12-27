import { FC } from 'react';
import { useContextSelector } from 'use-context-selector';

import { AppContext } from '../context';
import { Layout } from '../components/Layout';

export const AppPage: FC = () => {
  const userId = useContextSelector(AppContext, (ctx) => ctx.state.userId);
  return (
    <Layout>
      <h1>{`userId: ${userId}`}</h1>
    </Layout>
  );
};
