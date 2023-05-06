import type { AppProps } from 'next/app';

import Layout from '@components/common/layout';
import '@styles/globals.css';
import { ThemeProvider } from 'styled-components';
import { customTheme } from '../public/assets/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={customTheme}>
      <Layout>
        <Component {...pageProps} />;
      </Layout>
    </ThemeProvider>
  );
}
