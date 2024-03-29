import { Fragment, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CardRow from '../components/wordle/cardRow';
import styles from '../styles/Wordle.module.css';
import Keyboard from 'react-simple-keyboard';

const isLetter = (l) => 'qwertyuiopåasdfghjklöäzxcvbnm'.includes(l);

function Wordle() {
  const inputRef = useRef();
  const [solutionWord, setSolutionWord] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [guessedWords, setGuessedWords] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  });
  const [currentRowIdx, setCurrentRowIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [greenKeys, setGreenKeys] = useState(' ');
  const [yellowKeys, setYellowKeys] = useState(' ');
  const [disabledKeys, setDisabledKeys] = useState(' ');

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
            setSolutionWord(word);
          }
          if (session) {
            setGuessedWords(session.guessedWords);
            setCurrentRowIdx(session.rowIndex);
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
    if (currentRowIdx > 5 || ['WON', 'LOST'].includes(gameStatus)) return;

    const value = event.target.value.toLowerCase();
    const currentWord = guessedWords[currentRowIdx];
    if (currentWord.length < 5 || value.length < currentWord.length) {
      setGuessedWords((prev) => ({
        ...prev,
        [parseInt(currentRowIdx)]: value,
      }));
    }
  };

  const getGameStatus = () => {
    const guesses = Object.entries(guessedWords)
      .map(([, val]) => val)
      .filter((x) => x);

    if (guesses.includes(solutionWord)) return 'WON';
    if (guesses.length === 6 && !guesses.includes(solutionWord)) return 'LOST';
    return 'IN_PROGRESS';
  };

  const handleWordEnter = (event) => {
    event.preventDefault();

    const guessedWord = guessedWords[currentRowIdx];
    if (guessedWord.length !== 5) return;

    const greens = guessedWord
      .split('')
      .filter((l, i) => solutionWord[i] === l);
    const newGreenKeys = greenKeys.concat(' ' + greens.join(' '));
    setGreenKeys(newGreenKeys);

    const yellows = guessedWord
      .split('')
      .filter(
        (l, i) =>
          solutionWord[i] !== l &&
          solutionWord.includes(l) &&
          !greenKeys.concat(greens.join(' ')).includes(l),
      );
    const newYellowKeys = yellowKeys.concat(' ' + yellows.join(' '));
    setYellowKeys(newYellowKeys);

    const disabled = guessedWord
      .split('')
      .filter((l) => !solutionWord.includes(l));
    const newDisabledKeys = disabledKeys.concat(' ' + disabled.join(' '));
    setDisabledKeys(newDisabledKeys);

    const status = getGameStatus();
    axios.post('/api/wordle/session', {
      guessedWords,
      rowIndex: currentRowIdx + 1,
      gameStatus: status,
      greenKeys: newGreenKeys,
      yellowKeys: newYellowKeys,
      disabledKeys: newDisabledKeys,
    });

    setCurrentRowIdx((prev) => prev + 1);
    setGameStatus(status);
  };

  const onKeyboardKeyPress = (key) => {
    if (key === '{ent}') {
      return handleWordEnter({
        preventDefault: () => 'hack',
      });
    } else if (key === '{backspace}') {
      return handleEnteredWordChange({
        target: { value: guessedWords[currentRowIdx].slice(0, -1) },
      });
    } else if (isLetter(key)) {
      return handleEnteredWordChange({
        target: { value: guessedWords[currentRowIdx] + key },
      });
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.textCenter}>Suomi Wordle 🇫🇮</p>
      <div className={styles.cardContainer}>
        <CardRow
          enteredWord={guessedWords[0]}
          shouldFlip={currentRowIdx >= 1}
          correctWord={solutionWord}
        />
        <CardRow
          enteredWord={guessedWords[1]}
          shouldFlip={currentRowIdx >= 2}
          correctWord={solutionWord}
        />
        <CardRow
          enteredWord={guessedWords[2]}
          shouldFlip={currentRowIdx >= 3}
          correctWord={solutionWord}
        />
        <CardRow
          enteredWord={guessedWords[3]}
          shouldFlip={currentRowIdx >= 4}
          correctWord={solutionWord}
        />
        <CardRow
          enteredWord={guessedWords[4]}
          shouldFlip={currentRowIdx >= 5}
          correctWord={solutionWord}
        />
        <CardRow
          enteredWord={guessedWords[5]}
          shouldFlip={currentRowIdx >= 6}
          correctWord={solutionWord}
        />
      </div>
      {loading ? (
        <p className={styles.textCenter}>Loading...</p>
      ) : (
        <Fragment>
          <form className={styles.formi} onSubmit={handleWordEnter}>
            <input
              className={styles.input}
              type="text"
              value={guessedWords[currentRowIdx] || ''}
              onChange={handleEnteredWordChange}
              ref={inputRef}
            />
            <button type="submit" hidden={true}>
              Enter
            </button>
          </form>
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
        </Fragment>
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
