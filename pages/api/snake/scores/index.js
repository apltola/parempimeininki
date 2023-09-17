import { sql } from '@vercel/postgres';

export default async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { player, points } = req.body;
  await sql`INSERT INTO snake_scores (player, points) VALUES (${player}, ${points});`;

  res.json({ created: true });
}
