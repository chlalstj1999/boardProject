import { Pool } from "pg";

const pool = new Pool({
  user: "ubuntu",
  password: "1234",
  host: "localhost",
  port: 5432,
  database: "post",
  max: 5,
});

export default pool;
