import { connectToDatabase } from '../../util/mongodb';

export default async function (req, res) {
  const { db } = await connectToDatabase();

  const collection = await db.collection('snakescores');

  if (req.method === 'POST') {
    // insert new document to collection
    await collection.insert(req.body);
    const scores = await collection
      .find({})
      .sort({ points: -1 })
      .limit(10)
      .toArray();
    res.send(scores);
  } else {
    // fetch documents from collection
    const scores = await collection
      .find({})
      .sort({ points: -1 })
      .limit(10)
      .toArray();
    res.send(scores);
  }
}
