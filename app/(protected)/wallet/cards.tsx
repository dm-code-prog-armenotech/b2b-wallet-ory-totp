'use client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Grid } from '@tremor/react';
import { MoneyCard } from './money-card';
import { SalesCard } from './sales-card';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 5 * 60 * 1000
    }
  }
});

export const Cards = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        <MoneyCard />
        <SalesCard />
      </Grid>
      <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
    </QueryClientProvider>
  );
};
