import { useState } from 'react';
import lyrics from '../lib/papruLyrics';
import shuffle from '../util/shuffleArray';
import styles from '../styles/Papru.module.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function Papruipsum() {
  const [wordsAmount, setWordsAmount] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const getTotalWordsAmount = () => {
    let amount = 0;

    for (let lyric of lyrics) {
      let words = lyric
        .split(' ')
        .map((w) => w.trim())
        .filter((w) => w !== '');

      amount = amount + words.length;
    }

    return amount;
  };

  const handleChange = (e) => {
    const totalWords = getTotalWordsAmount();
    if (e.target.value > totalWords) {
      setWordsAmount(totalWords);
    } else {
      setWordsAmount(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let generatedWords = [];

    for (let lyric of shuffle(lyrics)) {
      let words = lyric
        .split(' ')
        .map((w) => w.trim())
        .filter((w) => w !== '');

      if (generatedWords.length + words.length <= wordsAmount) {
        generatedWords = [...generatedWords, ...words];
      } else if (generatedWords.length + words.length > wordsAmount) {
        const takeThisMuch = wordsAmount - generatedWords.length;
        const remaining = words.splice(0, takeThisMuch);
        generatedWords = [...generatedWords, ...remaining];
      }
    }

    const lastWord = generatedWords[generatedWords.length - 1].trim();
    const lastChar = lastWord.charAt(lastWord.length - 1);
    if (lastChar !== '.' && lastChar !== '?') {
      generatedWords.pop();
      generatedWords.push(`${lastWord}.`);
    }

    setResult(generatedWords.join(' '));
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1>Papru Ipsum</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="wordsAmount">Words Amount</label>
          <div className={styles.inputRow}>
            <div className={styles.left}>
              <input
                type="number"
                value={wordsAmount}
                onChange={handleChange}
                name="wordsAmount"
                min={1}
              />
              <button
                type="submit"
                className={styles.button}
                disabled={!(wordsAmount > 0)}
                style={{ cursor: wordsAmount > 0 ? 'pointer' : 'not-allowed' }}
              >
                Generate
              </button>
            </div>
            <CopyToClipboard text={result} onCopy={() => console.log('copied')}>
              <button type="button" className={styles.button}>
                Copy to clipboard
              </button>
            </CopyToClipboard>
          </div>
        </form>
        <div className={styles.words}>{result || `...`}</div>
      </div>
    </section>
  );
}
