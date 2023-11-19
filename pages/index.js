import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';

export default function Home() {
  const [showSnakeDisclaimer, setShowSnakeDisclaimer] = useState(false);

  function handleSnakeMobileTouch() {
    if (!isMobile) return;
    setShowSnakeDisclaimer(true);
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
          className={styles.card}
          onTouchStart={handleSnakeMobileTouch}
          // scroll={isMobile ? false : true}
        >
          <h2>
            🐍 Snake <span className={styles.arrowContainer}>&rarr;</span>
          </h2>
          <p>Classic snake game</p>
          {showSnakeDisclaimer && (
            <p className={styles.error}>
              Snake game is not compatible with mobile devices :/
            </p>
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
