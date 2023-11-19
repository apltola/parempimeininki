import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';

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
          <h3>⌨️ Typing Game &rarr;</h3>
          <p>Type as many words as you can in 60 seconds</p>
        </Link>

        <Link href="/papruipsum">
          <h3>📜 Papruipsum &rarr;</h3>
          <p>Lorem ipsum generator with Paperi-T lyrics</p>
        </Link>

        <Link href="/wordle">
          <h3>🟩 Wordle &rarr;</h3>
          <p>Wordle with Finnish words</p>
        </Link>

        <Link href={isMobile ? '/' : '/snake'} scroll={isMobile ? false : true}>
          <h3>🐍 Snake &rarr;</h3>
          <p>Classic snake game</p>
          {showSnakeDisclaimer && (
            <div className={styles.error}>
              Snake game is not compatible with mobile devices :/
            </div>
          )}
        </Link>
      </div>
    </section>
  );
}
