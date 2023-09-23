'use client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Grid } from '@tremor/react';
import { MoneyCard } from './money-card';
import { SalesCard } from './sales-card';

const queryClient = new QueryClient();

export const Cards = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        <MoneyCard />
        <SalesCard />
      </Grid>
    </QueryClientProvider>
  );
};
