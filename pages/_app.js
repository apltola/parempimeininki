import '../styles/globals.css';
import 'react-simple-keyboard/build/css/index.css';
import React from 'react';
import Header from '../components/header';
import Head from 'next/head';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

function MyApp({ Component, pageProps }) {
  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());

  return (
    <>
      <Head>
        <title>parempi meininki</title>
      </Head>
      <div className="app-container">
        <Header />
        <main className="app-main">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default MyApp;
