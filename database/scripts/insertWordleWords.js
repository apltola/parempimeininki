import { sql } from '@vercel/postgres';
import shuffle from '../../util/shuffleArray';
import wordleWords from '../wordleWords';

// Use this to insert wordle words from local file to Vercel Postgres instance
export default async function () {
  const shuffled = shuffle(wordleWords);

  const promises = shuffled.map((word, i) => {
    return sql`INSERT INTO wordle (word, date) VALUES (${word}, ${new Date(
      new Date().setDate(new Date().getDate() + i),
    )});`;
  });

  await Promise.all(promises);
}
