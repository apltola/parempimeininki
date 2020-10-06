import { useEffect, useState } from 'react';
import words from '../lib/words';
import styles from '../styles/Typing.module.css';
import Link from 'next/link';

const TypingGame = () => {
  const [gameOver, setGameOver] = useState(false);
  const [gameActive, setgameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [currentLetters, setCurrentLetters] = useState([]);

  useEffect(() => {
    if (!gameActive) {
      return;
    }

    addEventListener('keydown', handleKeyDown, true);
    setGameOver(false);
    const interval = setInterval(() => {
      setTimeLeft((current) => {
        const newTime = parseInt(current) - 1;
        if (newTime === 0) {
          setGameOver(true);
          setgameActive(false);
          clearInterval(interval);
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [gameActive]);

  useEffect(() => {
    if (currentLetters.join('') === currentWord && currentWord !== '') {
      setNewWord();
      setCurrentLetters([]);
      setScore((prev) => prev + 1);
    }
  }, [currentLetters]);

  const startGame = () => {
    setCurrentLetters([]);
    setgameActive(true);
    setGameOver(false);
    setTimeLeft(60);
    setScore(0);
    setNewWord();
  };

  const setNewWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
  };

  const handleKeyDown = (e) => {
    setCurrentLetters((current) => {
      if (e.keyCode === 8) {
        return current.splice(0, current.length - 1);
      } else {
        const char = String.fromCharCode(e.keyCode);
        return [...current, char];
      }
    });
  };

  let gameBoard;
  let correct;

  if (!gameActive && !gameOver) {
    gameBoard = (
      <div className={`${styles.gameBoard} ${styles.startScreen}`}>
        <div>TYPING GAME</div>
        <button onClick={startGame} className={styles.startButton}>
          start
        </button>
      </div>
    );
  }

  if (gameActive && !gameOver) {
    gameBoard = (
      <div className={`${styles.gameBoard} ${styles.playScreen}`}>
        <div className={styles.headerRow}>
          <div className={styles.left}>Time Left</div>
          <div className={styles.right}>Score</div>
        </div>
        <div className={styles.headerRow}>
          <div className={styles.left}>{timeLeft}</div>
          <div className={styles.right}>{score}</div>
        </div>
        <div className={styles.word}>
          {currentWord.split('').map((char, i) => {
            if (typeof currentLetters[i] === 'undefined') {
              correct = 'undefined';
            } else if (currentLetters[i] === char) {
              correct = 'true';
            } else {
              correct = 'false';
            }

            return (
              <span key={i} correct={correct} className={styles.letter}>
                {char}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (!gameActive && gameOver) {
    gameBoard = (
      <div className={`${styles.gameBoard} ${styles.gameOverScreen}`}>
        <div>GAME OVER</div>
        <div className={styles.score}>score: {score}</div>
        <button onClick={startGame} className={styles.startButton}>
          new game
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.container}>{gameBoard}</div>
    </div>
  );
};

export default TypingGame;
