import { MongoClient } from "mongodb";

// mongodb는 알아서 풀 관리해줌!!
// 그래도 옵션 사용하고싶으면 poolSize
let db: any;
let client;

const connectMongoDB = async () => {
  if (db) return db;

  client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    db = client.db("board");
    return db;
  } catch (err) {
    throw err;
  }
};

export default connectMongoDB;
