import { PoolClient } from "pg";

export class GetCommentDao {
  static isComment = async (commentIdx: number, conn: PoolClient) => {
    const comment = await conn.query(
      `SELECT idx, "accountIdx" FROM project.comment WHERE idx = $1`,
      [commentIdx]
    );
    const commentRows = comment.rows;

    return commentRows.length !== 0 ? commentRows[0] : [];
  };

  static getComments = async (postIdx: number, conn: PoolClient) => {
    const comments = await conn.query(
      `SELECT comment.idx AS "commentIdx", account.name AS "userName", comment.content AS comment, comment."createdAt", comment."countLike" AS "cntCommentLike"
        FROM project.comment 
        JOIN project.account ON comment."accountIdx" = account.idx 
        WHERE comment."postIdx" = $1 
        ORDER BY comment."createdAt" DESC`,
      [postIdx]
    );
    const commentsRows = comments.rows;

    return commentsRows.length !== 0 ? commentsRows : [];
  };

  static getIsCommentLike = async (
    accountIdx: number,
    commentIdx: number,
    conn: PoolClient
  ) => {
    const commentLike = await conn.query(
      `SELECT * FROM project."commentLike" WHERE "commentIdx" = $1 AND "accountIdx" = $2`,
      [commentIdx, accountIdx]
    );
    const commentLikeRows = commentLike.rows;

    return commentLikeRows.length !== 0 ? commentLikeRows[0] : [];
  };
}
