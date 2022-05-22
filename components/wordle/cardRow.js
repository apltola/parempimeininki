import React from 'react';
import styles from '../../styles/Wordle.module.css';
import Card from './card';

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

export default CardRow;