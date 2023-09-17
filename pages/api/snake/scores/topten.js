import { sql } from '@vercel/postgres';

export default async function (req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { rows } =
    await sql`SELECT * FROM snake_scores WHERE points IS NOT NULL AND player IS NOT NULL ORDER BY points DESC LIMIT 10;`;

  res.json(rows);
}
