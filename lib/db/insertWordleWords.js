const { Pool } = require('pg');
const words = require('../wordleWords');
const pool = new Pool();

const shuffleArray = (array) => {
  let currentIndex = array.length;
  let randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const insert = async () => {
  shuffleArray(words).forEach((word, i) => {
    pool.query(`INSERT INTO wordle (word, date) VALUES ($1, $2)`, [
      word,
      new Date(new Date().setDate(new Date().getDate() + i)),
    ]);
  });
};

insert();
