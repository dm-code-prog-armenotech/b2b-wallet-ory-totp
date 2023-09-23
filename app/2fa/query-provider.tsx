'use client';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { ReactNode } from 'react';

const queryProvider = new QueryClient();

export default function QP({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryProvider}>{children}</QueryClientProvider>
  );
}
