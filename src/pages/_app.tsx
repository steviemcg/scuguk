import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.scss';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Auth0Provider } from '@auth0/auth0-react';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isErrorPage = router.pathname === '/404';
  const isSvg = router.pathname.endsWith('ad');

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {!isErrorPage && !isSvg ? (
        <Auth0Provider
          domain='scug.eu.auth0.com'
          clientId='43Q01n8GCEy57DM1qmxM7C71Qw62ESy4'
          authorizationParams={{
            redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined,
          }}
        >
          <div id='page-container'>
            <Header />

            <Component {...pageProps} />

            <Footer />
          </div>
        </Auth0Provider>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
