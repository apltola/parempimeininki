import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Snake.module.css';
import axios from 'axios';
import SnakeScoreboard from '../components/snakeScoreboard';

export default function Snake2({ scoresList }) {
  const canv = useRef();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreIsTopTen, setScoreIsTopTen] = useState(false);

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

  function handleKeyDown(event) {
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

  function runGame() {
    if (!canv.current) {
      return;
    }

    setSnakePosition();

    // paint black background for canvas
    const ctx = canv.current.getContext('2d');
    ctx.fillStyle = '#2A2D34';
    ctx.fillRect(0, 0, canv.current.width, canv.current.height);

    // paint snake
    ctx.fillStyle = '#20FC8F';
    for (let i = 0; i < trail.length; i++) {
      const element = trail[i];
      ctx.fillRect(
        element.x * tileSize,
        element.y * tileSize,
        tileSize - 1,
        tileSize - 1
      );
      if (element.x == posX && element.y == posY) {
        console.log('GAME OVER');
        handleGameOver();
      }
    }

    trail.push({ x: posX, y: posY });
    if (trail.length > tail) {
      trail.shift();
    }

    // paint apple in random location
    if (appleX === posX && appleY == posY) {
      tail++;
      appleX = Math.floor(Math.random() * tileCount);
      appleY = Math.floor(Math.random() * tileCount);
      setScore((prev) => prev + 1);
    }
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(
      appleX * tileSize,
      appleY * tileSize,
      tileSize - 1,
      tileSize - 1
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
      case 'left':
        if (velocityX !== 1) {
          velocityX = -1;
          velocityY = 0;
        }
        break;
      case 'up':
        if (velocityY !== 1) {
          velocityX = 0;
          velocityY = -1;
        }
        break;
      case 'right':
        if (velocityX !== -1) {
          velocityX = 1;
          velocityY = 0;
        }
        break;
      case 'down':
        if (velocityY !== -1) {
          velocityX = 0;
          velocityY = 1;
        }
        break;
    }

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

    // reset events array so we don't have to do heavy looping
    keyDownEvents = [keyDownEvents[keyDownEvents.length - 1]];
  }

  function startGame() {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setScoreIsTopTen(false);
  }

  function handleGameOver() {
    setGameOver(true);

    if (scoresList.length >= 10) {
      const lowestInTopTen = scoresList[9];
      if (score > lowestInTopTen) {
        setScoreIsTopTen(true);
      }
    } else {
      setScoreIsTopTen(true);
    }
  }

  function renderGameBoard() {
    if (!gameStarted && !gameOver) {
      return (
        <div className={styles.canvasContainer}>
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
          <div className={styles.score}>Score: {score}</div>
          <canvas id="snakecanvas" width="400" height="400" ref={canv}></canvas>
          {gameOver && (
            <div className={styles.gameOverView}>
              <h2>Game over</h2>
              {scoreIsTopTen && <AddNewScore score={score} />}
              <div className={styles.restartBtnContainer}>
                <button
                  className={`${styles.btn} ${styles.restartButton}`}
                  onClick={startGame}
                >
                  Restart game
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  }

  async function insert() {
    const res = await axios.post('/api/snakescores', {
      player: 'juukeli',
      points: 55,
    });
    //const res = await axios.get('/api/snakescores');
    console.log(res.data);
  }

  return (
    <React.Fragment>
      <section className={styles.container}>
        <div className={styles.rowLeft}></div>
        {renderGameBoard()}
        <div className={styles.rowRight}>
          {gameStarted && <SnakeScoreboard scores={scoresList} />}
        </div>
      </section>
      {/* <div>connected to db: {JSON.stringify(props.isConnected, null, 2)}</div> */}
      <div>
        <button onClick={insert}>insert document</button>
      </div>
    </React.Fragment>
  );
}

function AddNewScore({ score }) {
  const [name, setName] = useState('');

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(name, score);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Congrats, your score is in the top 10!</p>
      <p>Please add a name for the scoreboard:</p>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="player name"
        className={styles.textInput}
      />
      <button type="submit" className={styles.btn}>
        Save
      </button>
    </form>
  );
}

export async function getServerSideProps(context) {
  //const { data } = await axios.get('/api/snakescores');
  const res = await fetch(`${process.env.BASE_URL}/api/snakescores`);
  const data = await res.json();

  return {
    props: { scoresList: data },
  };
}
