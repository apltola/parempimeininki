import jsonwebtoken from 'jsonwebtoken';
import cookie from 'cookie';

// const postHandler = (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).end();
//   }

//   const { guessedWords } = req.body;
//   console.log(guessedWords);
//   const token = jsonwebtoken.sign({ guessedWords }, process.env.JWT_SECRET);

//   res
//     .status(200)
//     .setHeader(
//       'Set-Cookie',
//       cookie.serialize('token', token, {
//         path: '/',
//         httpOnly: true,
//       })
//     )
//     .end();
// };

// const getHandler = (req, res) => {
//   if (req.method !== 'GET') {
//     return res.status(405).end();
//   }

//   const { token } = req.cookies;
//   console.log('token ==> ', token);
//   if (!token) {
//     return res.status(200).json({ guessedWords: null });
//   }

//   try {
//     const guessedWords = jsonwebtoken.verify(token, process.env.JWT_SECRET);
//     res.status(200).json(guessedWords);
//   } catch (error) {
//     res.status(403).json({ guessedWords: null });
//   }
// };

async function handler(req, res) {
  if (req.method === 'POST') {
    const { guessedWords } = req.body;
    console.log('posted guessedWords:', guessedWords);
    console.log('res is undefined?? ', res);
    const token = jsonwebtoken.sign({ guessedWords }, process.env.JWT_SECRET);

    res
      .status(200)
      .setHeader(
        'Set-Cookie',
        cookie.serialize('token', token, {
          path: '/',
          httpOnly: true,
        })
      )
      .end();
  } else if (req.method === 'GET') {
    const { token } = req.cookies;
    console.log('token ==> ', token);
    if (!token) {
      return res.status(200).json({ guessedWords: null });
    }

    try {
      const guessedWords = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      res.status(200).json(guessedWords);
    } catch (error) {
      res.status(403).json({ guessedWords: null });
    }
  }
}

export default handler;
