import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI সেট করা নেই (.env.local দেখুন)");

// dev-এ hot reload হলে বারবার নতুন connection খোলা ঠেকাতে global cache
const g = globalThis;
if (!g._mmMongo) g._mmMongo = new MongoClient(uri).connect();

export async function getCol() {
  const client = await g._mmMongo;
  return client
    .db(process.env.MONGODB_DB || "mydb")
    .collection(process.env.MONGODB_COLLECTION || "myhisab");
}
