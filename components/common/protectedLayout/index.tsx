import { ReactNode } from 'react';
import Header from '../header';
import Protected from '../protected';
import CookieTimeWatchWrapper from '../cookieWatch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Protected>
      <QueryClientProvider client={queryClient}>
        <Header />
        <CookieTimeWatchWrapper />
        {children}
      </QueryClientProvider>
    </Protected>
  );
}
