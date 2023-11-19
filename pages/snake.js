import { Fragment, useEffect, useRef, useState } from 'react';
import styles from '../styles/Snake.module.css';
import Scoreboard from '../components/snake/scoreboard';
import AddNewScore from '../components/snake/addNewScore';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';

export default function Snake(props) {
  const router = useRouter();
  const canvas = useRef();
  const [gameStarted, setGameStarted] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [topTenScores, setTopTenScores] = useState(props.topTenScores);
  const [scoreIsInTopTen, setScoreIsInTopTen] = useState(false);

  const [score, setScore] = useState(0); // Stateful score for DOM
  let _score = 0; // Score for component reference

  let posX = 10;
  let posY = 10;
  let velocityX = -1;
  let velocityY = 0;
  let trail = [];
  let tileSize = 20;
  let tileCount = 20;
  let tail = 5;
  let appleX = 12;
  let appleY = 12;
  let keyDownEvents = [{ direction: 'left', handled: false }];

  useEffect(() => {
    // The game doesn't work on mobile...
    if (isMobile) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) {
      return;
    }

    document.addEventListener('keydown', handleKeyDown, true);
    const interval = setInterval(paintCanvas, 100);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      clearInterval(interval);
    };
  }, [gameStarted, gameOver]);

  function handleKeyDown(event) {
    console.log('keydownEvents:', keyDownEvents);
    switch (event.keyCode) {
      case 37: // arrow left
        keyDownEvents.push({ direction: 'left', handled: false });
        break;
      case 38: // arrow up
        keyDownEvents.push({ direction: 'up', handled: false });
        break;
      case 39: // arrow right
        keyDownEvents.push({ direction: 'right', handled: false });
        break;
      case 40: // arrow down
        keyDownEvents.push({ direction: 'down', handled: false });
        break;
    }
  }

  function paintCanvas() {
    if (!canvas.current) {
      return;
    }

    setSnakePosition();

    // Paint black background for canvas
    const ctx = canvas.current.getContext('2d');
    ctx.fillStyle = '#373737';
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);

    // Paint snake
    ctx.fillStyle = '#96F550';
    for (let i = 0; i < trail.length; i++) {
      const element = trail[i];
      ctx.fillRect(
        element.x * tileSize,
        element.y * tileSize,
        tileSize - 1,
        tileSize - 1,
      );

      // If snake eats itself, end game
      if (element.x == posX && element.y == posY) {
        console.log('GAME OVER');
        handleGameOver();
      }
    }

    trail.push({ x: posX, y: posY });
    if (trail.length > tail) {
      trail.shift();
    }

    // Handle eating of apple
    if (appleX === posX && appleY == posY) {
      tail++;
      appleX = Math.floor(Math.random() * tileCount);
      appleY = Math.floor(Math.random() * tileCount);
      _score++;
      setScore((prev) => prev + 1);
    }
    ctx.fillStyle = '#F03A47';
    ctx.fillRect(
      appleX * tileSize,
      appleY * tileSize,
      tileSize - 1,
      tileSize - 1,
    );
  }

  function setSnakePosition() {
    let eventToProcess = keyDownEvents[keyDownEvents.length - 1];
    for (let i = 0; i < keyDownEvents.length; i++) {
      if (keyDownEvents[i].handled === false) {
        eventToProcess = keyDownEvents[i];
        keyDownEvents[i].handled = true;
        break;
      }
    }

    switch (eventToProcess.direction) {
      // Turn snake left if it isn't going right
      case 'left':
        if (velocityX !== 1) {
          velocityX = -1;
          velocityY = 0;
        }
        break;
      // Turn snake up if it isn't going down
      case 'up':
        if (velocityY !== 1) {
          velocityX = 0;
          velocityY = -1;
        }
        break;
      // Turn snake right if it isn't going left
      case 'right':
        if (velocityX !== -1) {
          velocityX = 1;
          velocityY = 0;
        }
        break;
      // Turn snake down if it isn't going up
      case 'down':
        if (velocityY !== -1) {
          velocityX = 0;
          velocityY = 1;
        }
        break;
    }

    // Set new position for snake
    posX = posX + velocityX;
    posY = posY + velocityY;

    // Handle snake going through walls
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

    // After event is processed, delete oldest event to avoid the array growing too large
    if (keyDownEvents.length > 1) {
      keyDownEvents.shift();
    }
  }

  function handleRestartGame() {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    _score = 0;
    setScoreIsInTopTen(false);
  }

  function handleGameOver() {
    setGameOver(true);

    const tenthScore = topTenScores[9].points;
    if (_score > tenthScore) {
      setScoreIsInTopTen(true);
    }
  }

  function renderGameBoard() {
    return (
      <div className={styles.canvasContainer}>
        <div className={styles.score}>Score: {score}</div>
        <canvas id="snakecanvas" width="400" height="400" ref={canvas}></canvas>
        {gameOver && (
          <div className={styles.gameOverView}>
            <h2>Game over</h2>
            {scoreIsInTopTen && (
              <AddNewScore
                score={score}
                callBack={(scores) => setTopTenScores(scores)}
              />
            )}
            <div className={styles.restartBtnContainer}>
              <button
                className={`${styles.btn} ${styles.restartButton}`}
                onClick={handleRestartGame}
              >
                Restart game
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Fragment>
      {!isMobile && (
        <section className={styles.container}>
          <div className={styles.rowLeft}></div>
          {renderGameBoard()}
          <div className={styles.rowRight}>
            {gameStarted && <Scoreboard scores={topTenScores} />}
          </div>
        </section>
      )}
    </Fragment>
  );
}

export async function getServerSideProps(ctx) {
  const res = await fetch(`${process.env.BASE_URL}/api/snake/scores/topten`);
  const scores = await res.json();

  return {
    props: { topTenScores: scores },
  };
}
