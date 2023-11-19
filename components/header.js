import { Fragment } from 'react';
import styles from '../styles/Header.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Header() {
  const str =
    'parempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininki';

  const router = useRouter();

  return (
    <Fragment>
      <header className={styles.header}>
        <div className={styles.text}>{str}</div>
      </header>
      <div className={styles.linkContainer}>
        {router.pathname !== '/' && <Link href="/">&larr; Back to Home</Link>}
      </div>
    </Fragment>
  );
}
