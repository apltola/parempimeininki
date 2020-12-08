import { useEffect, useRef, useState } from 'react';

export default function Snake2() {
  const canv = useRef();
  const [gameTime, setGameTime] = useState(0);
  const [vx, setVx] = useState(-1);
  const [vy, setVy] = useState(0);
  const [px, setPx] = useState(10);
  const [py, setPy] = useState(10);
  const [trail, setTrail] = useState([]);
  const [tileSize, setTileSize] = useState(20);
  const [tileCount, setTileCount] = useState(20);
  const [tailLength, setTailLength] = useState(5);
  const [keyEvents, setKeyEvents] = useState([]);
  const [renderGame, setRenderGame] = useState(0);

  // setup function
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime((prev) => prev + 1000);
    }, 100);
    document.addEventListener('keydown', handleKeyDown);
    //setKeyEvents((prev) => [...prev, { dir: 'left', handled: false }]);

    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // run game function
  useEffect(() => {
    /* if (renderGame === 0) {
      return;
    } */

    //setPx(px + vx);
    //setPy(py + vy);

    if (px < 0) {
      setPx(tileCount - 1);
    }
    if (px > tileCount - 1) {
      setPx(0);
    }
    if (py < 0) {
      setPy(tileCount - 1);
    }
    if (py > tileCount - 1) {
      setPy(0);
    }

    const ctx = canv.current.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canv.current.width, canv.current.height);

    const trailCopy = trail;

    ctx.fillStyle = 'red';
    //ctx.fillRect(px * tileSize, py * tileSize, tileSize, tileSize);
    for (let i = 0; i < trail.length; i++) {
      const element = trail[i];
      ctx.fillRect(
        element.x * tileSize,
        element.y * tileSize,
        tileSize - 1,
        tileSize - 1
      );
      if (element.x == px && element.y == py) {
        console.log('GAME OVER!!');
        //setGameOver(true);
      }
    }

    setTrail((prev) => {
      if (prev.length > tailLength) {
        const spliced = prev.splice(1, prev.length);
        return [...spliced, { x: px, y: py }];
      } else {
        return [...prev, { x: px, y: py }];
      }
    });
  }, [px, py]);

  // process keyEvents array in sequence
  useEffect(() => {
    let arr;
    if (keyEvents.length === 0) {
      arr = [{ dir: 'left', handled: false }];
    } else {
      arr = keyEvents;
    }
    let unhandledIdx;
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (!element.handled) {
        unhandledIdx = i;
        break;
      }
    }
    //const unhandledIdx = arr.findIndex((val) => !val.handled);
    if (unhandledIdx > -1) {
      //const arr = keyEvents;
      const event = arr[unhandledIdx];
      if (event.dir === 'left' && vx !== 1) {
        //setVx(-1);
        //setVy(0);
        setPx(px - 1);
        setPy(py + 0);
      }
      if (event.dir === 'up' && vy !== 1) {
        //setVx(0);
        //setVy(-1);
        setPx(px + 0);
        setPy(py - 1);
      }
      if (event.dir === 'right' && vx !== -1) {
        //setVx(1);
        //setVy(0);
        setPx(px + 1);
        setPy(py + 0);
      }
      if (event.dir === 'down' && vy !== -1) {
        //setVx(0);
        //setVy(1);
        setPx(px + 0);
        setPy(py + 1);
      }
      arr[unhandledIdx].handled = true;
      setKeyEvents(arr);
    } else {
      //const arr = keyEvents;
      const event = arr[arr.length - 1];
      if (event.dir === 'left') {
        setPx(px - 1);
        setPy(py + 0);
      }
      if (event.dir === 'up') {
        setPx(px + 0);
        setPy(py - 1);
      }
      if (event.dir === 'right') {
        setPx(px + 1);
        setPy(py + 0);
      }
      if (event.dir === 'down') {
        setPx(px + 0);
        setPy(py + 1);
      }
    }

    //setRenderGame((prev) => prev + 1);
  }, [gameTime]);

  // add keyDowns into keyEvents array
  function handleKeyDown(event) {
    switch (event.keyCode) {
      case 37: // arrow left
        setKeyEvents((prev) => [prev.pop(), { dir: 'left', handled: false }]);
        break;
      case 38: // arrow up
        setKeyEvents((prev) => [prev.pop(), { dir: 'up', handled: false }]);
        break;
      case 39: // arrow right
        setKeyEvents((prev) => [prev.pop(), { dir: 'right', handled: false }]);
        break;
      case 40: // arrow down
        setKeyEvents((prev) => [prev.pop(), { dir: 'down', handled: false }]);
        break;
    }
  }

  return (
    <div>
      <canvas height="400" width="400" ref={canv} />
      <div>{JSON.stringify(keyEvents, null, 2)}</div>
      <div>{JSON.stringify(trail, null, 2)}</div>
    </div>
  );
}
