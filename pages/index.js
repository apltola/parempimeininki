import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { GeistSans } from 'geist/font/sans';

export default function Home() {
  const [showSnakeDisclaimer, setShowSnakeDisclaimer] = useState(false);

  function onSnakeMouseEnter() {
    if (isMobile) {
      setShowSnakeDisclaimer(true);
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        <Link href="/wordle" className={styles.card}>
          <h2>
            🟩 Wordle <span className={styles.arrowContainer}>&rarr;</span>
          </h2>
          <p>Wordle with Finnish words</p>
        </Link>

        <Link
          href={isMobile ? '/' : '/snake'}
          scroll={isMobile ? false : true}
          className={styles.card}
        >
          <h2>
            🐍 Snake <span className={styles.arrowContainer}>&rarr;</span>
          </h2>
          <p>Classic snake game</p>
          {showSnakeDisclaimer && (
            <div className={styles.error}>
              Snake game is not compatible with mobile devices :/
            </div>
          )}
        </Link>
        <Link href="/typing" className={[styles.card]}>
          <h2>
            ⌨️ Typing Game <span className={styles.arrowContainer}>&rarr;</span>
          </h2>
          <p>Type as many words as you can in 60 seconds</p>
        </Link>

        <Link href="/papruipsum" className={styles.card}>
          <h2>
            📜 Papru ipsum <span className={styles.arrowContainer}>&rarr;</span>
          </h2>
          <p>Lorem ipsum generator with Paperi-T lyrics</p>
        </Link>
      </div>
    </section>
  );
}
