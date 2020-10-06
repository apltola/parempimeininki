import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home(props) {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>This is a website!</h1>

      <div className={styles.grid}>
        <Link href="/typing">
          <a className={styles.card}>
            <h3>Typing Game &rarr;</h3>
            <p>Type as many words as you can in 60 seconds</p>
          </a>
        </Link>

        <a href="https://nextjs.org/learn" className={styles.card}>
          <h3>Learn &rarr;</h3>
          <p>Learn about Next.js in an interactive course with quizzes!</p>
        </a>
      </div>
    </section>
  );
}
