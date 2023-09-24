'use client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NewGoogle } from './new_google';

const queryClient = new QueryClient();

export const Form = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NewGoogle />
      <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
    </QueryClientProvider>
  );
};
