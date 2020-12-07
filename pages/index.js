import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>This is a website!</h1>

      <div className={styles.grid}>
        <Link href="/typing">
          <a className={styles.card}>
            <h3>⌨️ Typing Game &rarr;</h3>
            <p>Type as many words as you can in 60 seconds</p>
          </a>
        </Link>

        <Link href="/papruipsum">
          <a className={styles.card}>
            <h3>📜 Papruipsum &rarr;</h3>
            <p>Lorem ipsum generator with Paperi-T lyrics</p>
          </a>
        </Link>

        <Link href="/snake">
          <a className={styles.card}>
            <h3>🐍 Snake &rarr;</h3>
            <p>Classic snake game</p>
          </a>
        </Link>
      </div>
    </section>
  );
}
