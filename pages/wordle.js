import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CardRow from '../components/wordle/cardRow';
import styles from '../styles/Wordle.module.css';
import Keyboard from 'react-simple-keyboard';

const isLetter = (l) => 'qwertyuiopåasdfghjklöäzxcvbnm'.includes(l);

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
  const [greenKeys, setGreenKeys] = useState(' ');
  const [yellowKeys, setYellowKeys] = useState(' ');
  const [disabledKeys, setDisabledKeys] = useState(' ');
  const inputRef = useRef();

  useEffect(() => {
    const handleKeyDown = () => inputRef.current.focus();

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
            console.log('session.rowIndex', session.rowIndex);
            setGuessedWords(session.guessedWords);
            setRowIndex(session.rowIndex);
            setGameStatus(session.gameStatus);
            setGreenKeys(session.greenKeys);
            setYellowKeys(session.yellowKeys);
            setDisabledKeys(session.disabledKeys);
          }
        });
      });
      window.addEventListener('keydown', handleKeyDown, true);
      setLoading(false);
    })();

    return () => window.removeEventListener('keydown', handleKeyDown, true);
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
    const currentWord = guessedWords[rowIndex];
    if (guessedWords[rowIndex].length !== 5) return;

    const greens = currentWord.split('').filter((l, i) => correctWord[i] === l);
    const newGreenKeys = greenKeys.concat(' ' + greens.join(' '));
    setGreenKeys(newGreenKeys);

    const yellows = currentWord
      .split('')
      .filter(
        (l, i) =>
          correctWord[i] !== l &&
          correctWord.includes(l) &&
          !greenKeys.concat(greens.join(' ')).includes(l)
      );
    const newYellowKeys = yellowKeys.concat(' ' + yellows.join(' '));
    setYellowKeys(newYellowKeys);

    const disabled = currentWord
      .split('')
      .filter((l) => !correctWord.includes(l));
    const newDisabledKeys = disabledKeys.concat(' ' + disabled.join(' '));
    setDisabledKeys(newDisabledKeys);

    const status = getGameStatus();
    axios.post('/api/wordle/session', {
      guessedWords,
      rowIndex: rowIndex + 1,
      gameStatus: status,
      greenKeys: newGreenKeys,
      yellowKeys: newYellowKeys,
      disabledKeys: newDisabledKeys,
    });

    setRowIndex((prev) => prev + 1);
    setGameStatus(status);
  };

  const shouldDisableInput = () => {
    return ['WON', 'LOST'].includes(gameStatus);
  };

  const onKeyboardKeyPress = (key) => {
    console.log('key', key);
    if (key === '{ent}') {
      return handleWordEnter({
        preventDefault: () => 'hack',
      });
    } else if (key === '{backspace}') {
      return handleEnteredWordChange({
        target: { value: guessedWords[rowIndex].slice(0, -1) },
      });
    } else if (isLetter(key)) {
      return handleEnteredWordChange({
        target: { value: guessedWords[rowIndex] + key },
      });
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.textCenter}>Suomi Wordle 🇫🇮</p>
      <div className={styles.cardContainer}>
        <CardRow
          enteredWord={guessedWords[0]}
          shouldFlip={rowIndex >= 1}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[1]}
          shouldFlip={rowIndex >= 2}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[2]}
          shouldFlip={rowIndex >= 3}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[3]}
          shouldFlip={rowIndex >= 4}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[4]}
          shouldFlip={rowIndex >= 5}
          correctWord={correctWord}
        />
        <CardRow
          enteredWord={guessedWords[5]}
          shouldFlip={rowIndex >= 6}
          correctWord={correctWord}
        />
      </div>
      {loading ? (
        <p className={styles.textCenter}>Loading...</p>
      ) : (
        <form className={styles.formi} onSubmit={handleWordEnter}>
          <input
            className={styles.input}
            type="text"
            value={guessedWords[rowIndex] || ''}
            onChange={handleEnteredWordChange}
            disabled={shouldDisableInput()}
            ref={inputRef}
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
      <div className={styles.keyboardContainer}>
        <Keyboard
          onKeyPress={onKeyboardKeyPress}
          mergeDisplay={true}
          layoutName="default"
          layout={{
            default: [
              'q w e r t y u i o p å',
              'a s d f g h j k l ö ä',
              '{ent} z x c v b n m {backspace}',
            ],
          }}
          display={{
            '{ent}': 'enter',
            '{backspace}': '⌫',
          }}
          theme={'hg-theme-default myTheme1'}
          buttonTheme={[
            { class: 'hg-disabled', buttons: disabledKeys },
            { class: 'hg-yellow', buttons: yellowKeys },
            { class: 'hg-green', buttons: greenKeys },
          ]}
        />
      </div>
    </div>
  );
}

export default Wordle;
