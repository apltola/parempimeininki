import '../styles/globals.css';
import Header from '../components/header';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <title>parempi meininki</title>
      </Head>
      <Header />
      <Component {...pageProps} />;
    </React.Fragment>
  );
}

/* export function getServerSideProps(ctx) {
  console.log('serverside', ctx);
  return {
    pageProps: {
      message: 'juukeli',
    },
  };
} */

export default MyApp;
