import styles from '../styles/Header.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Header() {
  const str =
    'parempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininkiparempimeininki';

  const router = useRouter();

  return (
    <React.Fragment>
      <header className={styles.header}>
        <div className={styles.text}>{str}</div>
      </header>
      <div className={styles.linkContainer}>
        {router.pathname !== '/' && (
          <Link href="/">
            <a>&larr; Back to Home</a>
          </Link>
        )}
      </div>
    </React.Fragment>
  );
}
