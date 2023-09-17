import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { useState } from 'react';

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

        <Link href="/wordle">
          <a className={styles.card}>
            <h3>🟩 Wordle &rarr;</h3>
            <p>Wordle with Finnish words</p>
          </a>
        </Link>

        <Link href={isMobile ? '/' : '/snake'} scroll={isMobile ? false : true}>
          <a
            className={styles.card}
            onMouseEnter={onSnakeMouseEnter}
            onMouseLeave={() => setShowSnakeDisclaimer(false)}
          >
            <h3>🐍 Snake &rarr;</h3>
            <p>Classic snake game</p>
            {showSnakeDisclaimer && (
              <div className={styles.error}>
                Snake game is not compatible with mobile devices :/
              </div>
            )}
          </a>
        </Link>
      </div>
    </section>
  );
}
