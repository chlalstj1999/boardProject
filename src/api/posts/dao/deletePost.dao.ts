import { PoolClient } from "pg";

export class DeletePostDao {
  static deletePost = async (postIdx: number, conn: PoolClient) => {
    await conn.query(`DELETE FROM project.post WHERE idx = $1`, [postIdx]);
  };

  static deletePostLike = async (
    accountIdx: number,
    postIdx: number,
    conn: PoolClient
  ) => {
    await conn.query(`BEGIN`);
    await conn.query(
      `DELETE FROM project."postLike" WHERE "postIdx" = $1 AND "accountIdx" = $2`,
      [postIdx, accountIdx]
    );
    await conn.query(
      `UPDATE project.post SET "countLike" = (
        SELECT COUNT(*)
        FROM project."postLike" 
        JOIN project.post ON "postLike"."postIdx" = post.idx
        ) WHERE idx = $1`,
      [postIdx]
    );
    await conn.query(`COMMIT`);
  };
}
