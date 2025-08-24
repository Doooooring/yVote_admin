import { ModalProvider } from '@/utils/hook/useModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import CookieTimeWatchWrapper from '../cookieWatch';
import Header from '../header';
import Protected from '../protected';

const queryClient = new QueryClient();

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Protected>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <Header />
          <CookieTimeWatchWrapper />
          {children}
        </ModalProvider>
      </QueryClientProvider>
    </Protected>
  );
}
