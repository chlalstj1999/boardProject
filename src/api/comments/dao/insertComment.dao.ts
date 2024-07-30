import { PoolClient } from "pg";

export class InsertCommentDao {
  accountIdx: number;
  postIdx: number;
  comment: string;

  constructor(data: { accountIdx: number; postIdx: number; comment: string }) {
    this.accountIdx = data.accountIdx;
    this.postIdx = data.postIdx;
    this.comment = data.comment;
  }

  static addComment = async (
    insertCommentDao: InsertCommentDao,
    conn: PoolClient
  ) => {
    await conn.query(
      `INSERT INTO project.comment ("postIdx", "accountIdx", content, "countLike") VALUES ($1, $2, $3, $4)`,
      [
        insertCommentDao.postIdx,
        insertCommentDao.accountIdx,
        insertCommentDao.comment,
        0,
      ]
    );
  };

  static addCommentLike = async (
    accountIdx: number,
    commentIdx: number,
    conn: PoolClient
  ) => {
    await conn.query(`BEGIN`);
    await conn.query(
      `INSERT INTO project."commentLike" ("commentIdx", "accountIdx") VALUES ($1, $2)`,
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
