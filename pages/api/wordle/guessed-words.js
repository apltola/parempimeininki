import jsonwebtoken from 'jsonwebtoken';
import { setCookies } from 'cookies-next';

const getTomorrowsDateString = () =>
  new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .slice(0, 10);

const postHandler = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { guessedWords } = req.body;
  const token = jsonwebtoken.sign({ guessedWords }, process.env.JWT_SECRET);
  console.log('posted guessedWords:', guessedWords);

  setCookies('wordlesession', token, {
    req,
    res,
    expires: new Date(`${getTomorrowsDateString()}T00:00:00.000Z`),
  });

  res.status(200).end();
};

const getHandler = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { wordlesession } = req.cookies;
  console.log('wordlesession ==> ', wordlesession);
  if (!wordlesession) {
    return res.status(200).json({ guessedWords: null });
  }

  try {
    const guessedWords = jsonwebtoken.verify(
      wordlesession,
      process.env.JWT_SECRET
    );
    res.status(200).json(guessedWords);
  } catch (error) {
    res.status(403).json({ guessedWords: null });
  }
};

async function handler(req, res) {
  if (req.method === 'POST') {
    postHandler(req, res);
  } else if (req.method === 'GET') {
    getHandler(req, res);
  }
}

export default handler;
