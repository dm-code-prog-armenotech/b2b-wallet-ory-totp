'use client';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { ReactNode } from 'react';

export default function QP({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
