import type { AppProps } from 'next/app';

import '@/styles/globals.css';
import Layout from '@components/common/layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalProvider } from '@utils/hook/useModal';
import { ThemeProvider } from 'styled-components';
import { customTheme } from '../public/assets/theme';

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({});

  return (
    <ThemeProvider theme={customTheme}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <Layout>
            <Component {...pageProps} />;
          </Layout>
        </ModalProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
