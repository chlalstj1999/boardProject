import * as mongoDB from "mongodb";
import { mongoHost } from "../const/environment";

const client: mongoDB.MongoClient = new mongoDB.MongoClient(
  `mongodb://${mongoHost}:27017`
);

client.connect();

export async function connectMongoDB() {
  return client;
}
