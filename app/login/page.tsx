'use client';
import { Card, Title } from '@tremor/react';
import Google from './google';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={
          'w-full h-[90%] flex flex-col items-center justify-center bg-gray-100 '
        }
      >
        <Card
          decoration={'top'}
          decorationColor={'indigo'}
          className={'w-[380px] flex flex-col gap-6 items-center p-12'}
        >
          <Title className={'font-bold text-3xl text-center'}>
            Welcome here, please sign in.
          </Title>
          <Google />
        </Card>
      </div>
    </QueryClientProvider>
  );
}
