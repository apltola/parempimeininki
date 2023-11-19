import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';

const getTomorrowsDateString = () =>
  new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .slice(0, 10);

async function postHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const {
    guessedWords,
    rowIndex,
    gameStatus,
    greenKeys,
    yellowKeys,
    disabledKeys,
  } = req.body;

  const token = jwt.sign(
    { guessedWords, rowIndex, gameStatus, greenKeys, yellowKeys, disabledKeys },
    process.env.JWT_SECRET,
  );

  setCookie('wordlesession', token, {
    req,
    res,
    expires: new Date(`${getTomorrowsDateString()}T00:00:00.000Z`),
  });

  res.status(200).end();
}

async function getHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { wordlesession } = req.cookies;
  if (!wordlesession) {
    return res.status(200).json({ session: null });
  }

  try {
    const session = jwt.verify(wordlesession, process.env.JWT_SECRET);
    res.status(200).json({ session });
  } catch (error) {
    res.status(403).json({ session: null });
  }
}

async function handler(req, res) {
  if (req.method === 'POST') {
    postHandler(req, res);
  } else if (req.method === 'GET') {
    getHandler(req, res);
  }
}

export default handler;
