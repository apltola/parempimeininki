import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        Powered by{' '}
        <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
      </span>
      <a
        href="https://github.com/apltola/parempimeininki"
        target="_blank"
        rel="noopener noreferrer"
      >
        Code on Github
      </a>
    </footer>
  );
}
