import '../styles/globals.css';
import 'react-simple-keyboard/build/css/index.css';
import 'nprogress/nprogress.css';
import { Fragment } from 'react';
import Head from 'next/head';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import Header from '../components/header';
import { GeistSans } from 'geist/font/sans';

function MyApp({ Component, pageProps }) {
  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());

  return (
    <Fragment>
      <Head>
        <title>parempi meininki</title>
      </Head>
      <div className={`app-container ${GeistSans.className}`}>
        <Header />
        <main className={`app-main ${GeistSans.className}`}>
          <Component {...pageProps} />
        </main>
      </div>
    </Fragment>
  );
}

export default MyApp;
