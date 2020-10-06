import '../styles/globals.css';
import Header from '../components/header';
import Head from 'next/head';
import Footer from '../components/footer';

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <title>parempi meininki</title>
      </Head>
      <div className="app-container">
        <Header />
        <main className="app-main">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
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
