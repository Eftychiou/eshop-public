import Head from 'next/head';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import Layout from '../components/layout/layout';
import { ModalsContextProvider } from '../store/modals_context';
import {
  faCheckSquare,
  faCoffee,
  faShoppingCart,
  faUser,
  faArrowLeft,
  faArrowRight,
  faGreaterThan,
  faLessThan
} from '@fortawesome/free-solid-svg-icons';

library.add(fab, faCheckSquare, faCoffee, faShoppingCart, faUser, faArrowLeft, faArrowRight, faGreaterThan, faLessThan);

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Eshop</title>
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#252226'></meta>
        <link rel='icon' type='image/png' sizes='512x512' href='/icons/icon-512x512.png' />
        <link rel='apple-touch-icon' type='image/png' sizes='512x512' href='/icons/icon-512x512.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/icons/icon-192x192.png' />
        <link rel='apple-touch-icon' type='image/png' sizes='192x192' href='/icons/icon-192x192.png' />
        <meta charSet='utf-8' />
        <meta name='robots' content='noindex, nofollow' />
        <meta name='viewport' content='width=device-width' />
        <meta name='description' content='A site for my programming portfolio' />
      </Head>

      <SessionProvider session={pageProps.session}>
        <ModalsContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ModalsContextProvider>
      </SessionProvider>
    </div>
  );
}
