import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Wordle.module.css';

function Card({ frontText, backText, flip, i, color }) {
  return (
    <div className={styles.card} flip={flip.toString()}>
      <div className={styles.cardInner} i={i}>
        <div className={styles.cardFront}>{frontText}</div>
        <div className={styles.cardBack} color={color}>
          {backText}
        </div>
      </div>
    </div>
  );
}

function CardRow({ enteredWord, flip, correctWord }) {
  const getColor = (letter, i) => {
    if (correctWord[i] === letter) return 'green';

    // The following madness determines if flipped letter needs to be yellow
    const correctLetters = correctWord.split('');
    const enteredLetters = enteredWord.split('');
    const instancesOfCurrentLetterInCorrectWord = correctLetters.filter(
      (l) => l === letter
    ).length;
    const correctlyPlacedCurrentLetters = enteredLetters.filter(
      (l, idx) => l === letter && correctLetters[idx] === l
    ).length;
    const enteredWordUpToThisPoint = enteredLetters.slice(0, i + 1);
    const enteredInstancesNotPlacedCorrectly = enteredWordUpToThisPoint.filter(
      (l, idx) =>
        correctLetters.includes(l) && correctLetters[idx] !== l && l === letter
    );
    if (
      correctWord.includes(letter) &&
      instancesOfCurrentLetterInCorrectWord > correctlyPlacedCurrentLetters &&
      correctlyPlacedCurrentLetters + enteredInstancesNotPlacedCorrectly.length <= instancesOfCurrentLetterInCorrectWord // prettier-ignore
    ) {
      return 'yellow';
    }

    return 'gray';
  };

  return (
    <React.Fragment>
      <Card
        frontText={enteredWord[0]}
        backText={enteredWord[0]}
        flip={flip}
        i={'0'}
        color={getColor(enteredWord[0], 0)}
      />
      <Card
        frontText={enteredWord[1]}
        backText={enteredWord[1]}
        flip={flip}
        i={'1'}
        color={getColor(enteredWord[1], 1)}
      />
      <Card
        frontText={enteredWord[2]}
        backText={enteredWord[2]}
        flip={flip}
        i={'2'}
        color={getColor(enteredWord[2], 2)}
      />
      <Card
        frontText={enteredWord[3]}
        backText={enteredWord[3]}
        flip={flip}
        i={'3'}
        color={getColor(enteredWord[3], 3)}
      />
      <Card
        frontText={enteredWord[4]}
        backText={enteredWord[4]}
        flip={flip}
        i={'4'}
        color={getColor(enteredWord[4], 4)}
      />
    </React.Fragment>
  );
}

function Wordle() {
  const [correctWord, setCorrectWord] = useState('');
  const [guessedWords, setGuessedWords] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  });
  const [rowIndex, setRowIndex] = useState(0);

  useEffect(() => {
    (async function setup() {
      const { word: correctWord } = (await axios.get('/api/wordle/todays-word')).data; // prettier-ignore
      setCorrectWord(correctWord);
      console.log(correctWord);

      const { guessedWords: alreadyGuessed } = (await axios.get('/api/wordle/guessed-words')).data; // prettier-ignore
      if (alreadyGuessed) {
        setGuessedWords(alreadyGuessed);
        // Get index of next word to guess
        const unsolvedRows = Object.entries(alreadyGuessed).filter(
          ([, val]) => !val
        );
        if (unsolvedRows[0]) {
          setRowIndex(parseInt(unsolvedRows[0][0]));
        } else {
          setRowIndex(6); // kinda hacky
        }
      }
    })();
  }, []);

  const handleEnteredWordChange = (event) => {
    if (rowIndex > 5) return;

    const {
      target: { value },
    } = event;

    const i = rowIndex;
    if (guessedWords[i].length < 5 || value.length < guessedWords[i].length) {
      setGuessedWords((prev) => ({
        ...prev,
        [i]: value,
      }));
    }
  };

  const handleWordEnter = (event) => {
    event.preventDefault();
    if (guessedWords[rowIndex].length !== 5) return;
    axios.post('/api/wordle/guessed-words', { guessedWords });
    setRowIndex((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
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
      <form className={styles.formi} onSubmit={handleWordEnter}>
        <input
          type="text"
          value={guessedWords[rowIndex] || ''}
          onChange={handleEnteredWordChange}
          autoFocus={true}
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}

export default Wordle;
