import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Snake.module.css';

export default function Snake2() {
  const canv = useRef();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  let posX = 10;
  let posY = 10;
  let velocityX = -1;
  let velocityY = 0;
  let trail = [];
  let gridSize = 20;
  let tileCount = 20;
  let tail = 5;
  let appleX = 12;
  let appleY = 12;

  useEffect(() => {
    if (!gameStarted || gameOver) {
      return;
    }

    document.addEventListener('keydown', handleKeyDown, true);
    const interval = setInterval(runGame, 100);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      clearInterval(interval);
    };
  }, [gameStarted, gameOver]);

  const handleKeyDown = (event) => {
    switch (event.keyCode) {
      case 37: // arrow left
        if (velocityX !== 1) {
          velocityX = -1;
          velocityY = 0;
        }
        break;
      case 38: // arrow up
        if (velocityY !== 1) {
          velocityX = 0;
          velocityY = -1;
        }
        break;
      case 39: // arrow right
        if (velocityX !== -1) {
          velocityX = 1;
          velocityY = 0;
        }
        break;
      case 40: // arrow down
        if (velocityY !== -1) {
          velocityX = 0;
          velocityY = 1;
        }
        break;
    }
  };

  const runGame = () => {
    if (!canv.current) {
      return;
    }
    const ctx = canv.current.getContext('2d');

    posX = posX + velocityX;
    posY = posY + velocityY;
    if (posX < 0) {
      posX = tileCount - 1;
    }
    if (posX > tileCount - 1) {
      posX = 0;
    }
    if (posY < 0) {
      posY = tileCount - 1;
    }
    if (posY > tileCount - 1) {
      posY = 0;
    }

    ctx.fillStyle = '#2A2D34';
    ctx.fillRect(0, 0, canv.current.width, canv.current.height);

    ctx.fillStyle = '#20FC8F';
    for (let i = 0; i < trail.length; i++) {
      const element = trail[i];
      ctx.fillRect(
        element.x * gridSize,
        element.y * gridSize,
        gridSize - 2,
        gridSize - 2
      );
      if (element.x == posX && element.y == posY) {
        console.log('game over');
        setGameOver(true);
      }
    }

    trail.push({ x: posX, y: posY });
    if (trail.length > tail) {
      trail.shift();
    }

    if (appleX === posX && appleY == posY) {
      tail++;
      appleX = Math.floor(Math.random() * tileCount);
      appleY = Math.floor(Math.random() * tileCount);
      setScore((prev) => prev + 1);
    }
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(
      appleX * gridSize,
      appleY * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  const renderGameBoard = () => {
    if (!gameStarted && !gameOver) {
      return (
        <div>
          <button
            className={`${styles.btn} ${styles.startButton}`}
            onClick={startGame}
          >
            Start game
          </button>
        </div>
      );
    } else {
      return (
        <div className={styles.canvasContainer}>
          {!gameOver && <div className={styles.score}>Score: {score}</div>}
          <canvas id="snakecanvas" width="400" height="400" ref={canv}></canvas>
          {gameOver && (
            <div className={styles.gameOverView}>
              <h2>You're dead!</h2>
              <h3>Score: {score}</h3>
              <button
                className={`${styles.btn} ${styles.restartButton}`}
                onClick={startGame}
              >
                Restart
              </button>
            </div>
          )}
        </div>
      );
    }
  };

  return <section className={styles.container}>{renderGameBoard()}</section>;
}
