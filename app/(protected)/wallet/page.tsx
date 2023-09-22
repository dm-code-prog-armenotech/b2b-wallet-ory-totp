'use client';
import { Grid } from '@tremor/react';
import { MoneyCard } from './money-card';

import { QueryClient, QueryClientProvider } from 'react-query';

export default function Page() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <QueryClientProvider client={new QueryClient()}>
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
          <MoneyCard />
        </Grid>
      </QueryClientProvider>
    </main>
  );
}
