import { connectToMongoDatabase } from '../../database/mongo';

export default async function (req, res) {
  const { db } = await connectToMongoDatabase();

  const collection = await db.collection('snakescores');

  if (req.method === 'POST') {
    await collection.insert(req.body);
    const scores = await collection
      .find({})
      .sort({ points: -1 })
      .limit(10)
      .toArray();
    res.send(scores);
  } else {
    const scores = await collection
      .find({})
      .sort({ points: -1 })
      .limit(10)
      .toArray();
    res.send(scores);
  }
}
