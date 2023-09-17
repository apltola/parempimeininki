import { sql } from '@vercel/postgres';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const todaysDateString = new Date().toISOString().slice(0, 10);

  const {
    rows: [row],
  } =
    await sql`SELECT word FROM wordle WHERE date::date = ${todaysDateString} LIMIT 1;`;

  res.status(200).json({ word: row.word });
}

export default handler;
