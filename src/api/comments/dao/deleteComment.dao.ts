import { PoolClient } from "pg";

export class DeleteCommentDao {
  static deleteComment = async (commentIdx: number, conn: PoolClient) => {
    await conn.query(`DELETE FROM project.comment WHERE idx = $1`, [
      commentIdx,
    ]);
  };

  static deleteCommentLike = async (
    accountIdx: number,
    commentIdx: number,
    conn: PoolClient
  ) => {
    await conn.query(`BEGIN`);
    await conn.query(
      `DELETE FROM project."commentLike" WHERE "commentIdx" = $1 AND "accountIdx" = $2`,
      [commentIdx, accountIdx]
    );
    await conn.query(
      `UPDATE project.comment SET "countLike" = (
        SELECT COUNT(*)
        FROM project."commentLike" 
        JOIN project.comment ON "commentLike"."commentIdx" = comment.idx
        ) WHERE idx = $1`,
      [commentIdx]
    );
    await conn.query(`COMMIT`);
  };
}
