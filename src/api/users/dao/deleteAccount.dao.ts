import { PoolClient } from "pg";

export class DeleteAccountDao {
  static deleteUser = async (accountIdx: number, conn: PoolClient) => {
    await conn.query(`DELETE FROM project.account WHERE idx = $1`, [
      accountIdx,
    ]);
  };
}
