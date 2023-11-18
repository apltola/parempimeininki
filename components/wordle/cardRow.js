import { Fragment } from 'react';
import Card from './card';

function CardRow({ enteredWord, shouldFlip, correctWord }) {
  const getCardColor = (cardLetter, i) => {
    if (correctWord[i] === cardLetter) return 'green';

    // The following madness determines if flipped letter needs to be yellow
    const correctLetters = correctWord.split('');
    const enteredLetters = enteredWord.split('');
    const instancesOfCurrentLetterInCorrectWord = correctLetters.filter(
      (l) => l === cardLetter,
    ).length;
    const correctlyPlacedCurrentLetters = enteredLetters.filter(
      (l, idx) => l === cardLetter && correctLetters[idx] === l,
    ).length;
    const enteredWordUpToThisPoint = enteredLetters.slice(0, i + 1);
    const enteredInstancesNotPlacedCorrectly = enteredWordUpToThisPoint.filter(
      (l, idx) =>
        correctLetters.includes(l) &&
        correctLetters[idx] !== l &&
        l === cardLetter,
    );
    if (
      correctWord.includes(cardLetter) &&
      instancesOfCurrentLetterInCorrectWord > correctlyPlacedCurrentLetters &&
      correctlyPlacedCurrentLetters +
        enteredInstancesNotPlacedCorrectly.length <=
        instancesOfCurrentLetterInCorrectWord
    ) {
      return 'yellow';
    }

    return 'gray';
  };

  return (
    <Fragment>
      <Card
        frontText={enteredWord[0]}
        backText={enteredWord[0]}
        flip={shouldFlip}
        i={'0'}
        color={getCardColor(enteredWord[0], 0)}
      />
      <Card
        frontText={enteredWord[1]}
        backText={enteredWord[1]}
        flip={shouldFlip}
        i={'1'}
        color={getCardColor(enteredWord[1], 1)}
      />
      <Card
        frontText={enteredWord[2]}
        backText={enteredWord[2]}
        flip={shouldFlip}
        i={'2'}
        color={getCardColor(enteredWord[2], 2)}
      />
      <Card
        frontText={enteredWord[3]}
        backText={enteredWord[3]}
        flip={shouldFlip}
        i={'3'}
        color={getCardColor(enteredWord[3], 3)}
      />
      <Card
        frontText={enteredWord[4]}
        backText={enteredWord[4]}
        flip={shouldFlip}
        i={'4'}
        color={getCardColor(enteredWord[4], 4)}
      />
    </Fragment>
  );
}

export default CardRow;
