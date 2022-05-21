// import { Pool } from 'pg';
// const pool = new Pool();

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  console.log('todays word enpoint');
  const todaysDateString = new Date().toISOString().slice(0, 10);

  // const {
  //   rows: [row],
  // } = await pool.query(`SELECT word FROM wordle WHERE date = $1`, [
  //   todaysDateString,
  // ]);

  res.status(200).json({ word: 'hihna' });
}

export default handler;