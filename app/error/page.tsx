'use client';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { Callout } from '@tremor/react';
import { kratos } from '../../lib/kratos';
import { ReactNode } from 'react';

export default function Page() {
  
  const query = useQuery(['get', 'user', 'facing', 'error'],
    async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get('id');
      const { data } = await kratos.getFlowError({
        id: id || ''
      });
      return data;
    }
  );
  
  let children: ReactNode = '';
  
  if (query.isLoading) {
    children = 'Loading...';
  }
  
  if (query.isSuccess) {
    children = JSON.stringify(query.data.error, null, 2);
  }
  
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Callout title={'Error'} className={'w-[380px]'}>
        {children}
      </Callout>
    </QueryClientProvider>
  );
}