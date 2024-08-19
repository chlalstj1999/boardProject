import { Pool } from "pg";
import { pgHost, pgId, pgPw } from "../const/environment";

const pool = new Pool({
  user: pgId,
  password: pgPw,
  host: pgHost,
  port: 5432,
  database: "post",
  max: 5,
});

pool.connect();

export default pool;
