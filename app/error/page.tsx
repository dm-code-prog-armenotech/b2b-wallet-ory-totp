'use client';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { Callout } from '@tremor/react';
import { kratos } from '../../lib/kratos';

export default function Page() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Callout title={'Error'} className={'w-[380px]'}>
        <Error />
      </Callout>
    </QueryClientProvider>
  );
}


const Error = () => {
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
  
  
  if (query.isLoading) {
    return 'Loading...';
  }
  
  if (query.isSuccess) {
    return JSON.stringify(query.data.error, null, 2);
  }
  
  return null;
};