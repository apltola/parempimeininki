import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CardRow from '../components/wordle/cardRow';
import styles from '../styles/Wordle.module.css';

function Wordle() {
  const [correctWord, setCorrectWord] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [guessedWords, setGuessedWords] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  });
  const [rowIndex, setRowIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function setup() {
      await Promise.all([
        axios.get('/api/wordle/todays-word'),
        axios.get('/api/wordle/session'),
      ]).then((responses) => {
        responses.forEach((res) => {
          const { word, session } = res.data;
          if (word) {
            setCorrectWord(word);
          }
          if (session) {
            setGuessedWords(session.guessedWords);
            setRowIndex(session.rowIndex);
            setGameStatus(session.gameStatus);
          }
        });
      });
      setLoading(false);
    })();
  }, []);

  const handleEnteredWordChange = (event) => {
    if (rowIndex > 5) return;

    const value = event.target.value.toLowerCase();
    const currentWord = guessedWords[rowIndex];
    if (currentWord.length < 5 || value.length < currentWord.length) {
      setGuessedWords((prev) => ({
        ...prev,
        [parseInt(rowIndex)]: value,
      }));
    }
  };

  const getGameStatus = () => {
    const guesses = Object.entries(guessedWords)
      .map(([, val]) => val)
      .filter((x) => x);

    if (guesses.includes(correctWord)) return 'WON';
    if (guesses.length === 6 && !guesses.includes(correctWord)) return 'LOST';
    return 'IN_PROGRESS';
  };

  const handleWordEnter = (event) => {
    event.preventDefault();
    if (guessedWords[rowIndex].length !== 5) return;
    const status = getGameStatus();
    axios.post('/api/wordle/session', {
      guessedWords,
      rowIndex: rowIndex + 1,
      gameStatus: status,
    });
    setRowIndex((prev) => prev + 1);
    setGameStatus(status);
  };

  const shouldDisableInput = () => {
    return ['WON', 'LOST'].includes(gameStatus);
  };

  return (
    <div className={styles.container}>
      <p className={styles.textCenter}>Suomi Wordle 🇫🇮</p>
      <div className={styles.cardContainer}>
        <CardRow
          enteredWord={guessedWords[0]}
          flip={rowIndex >= 1}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[1]}
          flip={rowIndex >= 2}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[2]}
          flip={rowIndex >= 3}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[3]}
          flip={rowIndex >= 4}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[4]}
          flip={rowIndex >= 5}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[5]}
          flip={rowIndex >= 6}
          correctWord={correctWord}
        />
      </div>
      {loading ? (
        <p className={styles.textCenter}>Loading...</p>
      ) : (
        <form className={styles.formi} onSubmit={handleWordEnter}>
          <input
            type="text"
            value={guessedWords[rowIndex] || ''}
            onChange={handleEnteredWordChange}
            autoFocus={true}
            disabled={shouldDisableInput()}
          />
          <button type="submit" hidden={true} disabled={shouldDisableInput()}>
            Enter
          </button>
        </form>
      )}
      {gameStatus === 'WON' && (
        <p className={styles.textCenter}>✅ Voitit! Uusi sana huomenna!</p>
      )}
      {gameStatus === 'LOST' && (
        <p className={styles.textCenter}>❌ Hävisit! Uusi sana huomenna!</p>
      )}
    </div>
  );
}

export default Wordle;
