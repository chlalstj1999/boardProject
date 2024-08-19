import { Pool } from "pg";
import { CommentDto } from "../dto/comment.dto";

interface IcommentRepository {
  addComment(commentDto: CommentDto, conn: Pool): Promise<void>;
  addCommentLike(commentDto: CommentDto, conn: Pool): Promise<void>;
  putComment(commentDto: CommentDto, conn: Pool): Promise<void>;
  isComment(commentDto: CommentDto, conn: Pool): Promise<CommentDto>;
  getComments(commentDto: CommentDto, conn: Pool): Promise<CommentDto[]>;
  getIsCommentLike(commentDto: CommentDto, conn: Pool): Promise<any[]>;
  deleteComment(commentDto: CommentDto, conn: Pool): Promise<void>;
  deleteCommentLike(commentDto: CommentDto, conn: Pool): Promise<void>;
}

export class CommentRepository implements IcommentRepository {
  constructor(private readonly pool: Pool) {}

  async addComment(
    commentDto: CommentDto,
    conn: Pool = this.pool
  ): Promise<void> {
    await conn.query(
      `INSERT INTO project.comment ("postIdx", "accountIdx", content, "countLike") VALUES ($1, $2, $3, $4)`,
      [
        commentDto.postIdx,
        commentDto.accountIdx,
        commentDto.comment,
        commentDto.likes,
      ]
    );
  }

  async addCommentLike(
    commentDto: CommentDto,
    conn: Pool = this.pool
  ): Promise<void> {
    await conn.query(`BEGIN`);
    await conn.query(
      `INSERT INTO project."commentLike" ("commentIdx", "accountIdx") VALUES ($1, $2)`,
      [commentDto.commentIdx, commentDto.accountIdx]
    );
    await conn.query(
      `UPDATE project.comment SET "countLike" = (
          SELECT COUNT(*)
          FROM project."commentLike" 
          JOIN project.comment ON "commentLike"."commentIdx" = comment.idx
          ) WHERE idx = $1`,
      [commentDto.commentIdx]
    );
    await conn.query(`COMMIT`);
  }

  async putComment(
    commentDto: CommentDto,
    conn: Pool = this.pool
  ): Promise<void> {
    await conn.query(`UPDATE project.comment SET content = $1 WHERE idx = $2`, [
      commentDto.comment,
      commentDto.commentIdx,
    ]);
  }

  async isComment(
    commentDto: CommentDto,
    conn: Pool = this.pool
  ): Promise<CommentDto> {
    const commetQueryResult = await conn.query(
      `SELECT "accountIdx" FROM project.comment WHERE idx = $1`,
      [commentDto.commentIdx]
    );

    if (commetQueryResult.rows.length !== 0) {
      commentDto.authorIdx = commetQueryResult.rows[0].accountIdx;
    }

    return commentDto;
  }

  async getComments(
    commentDto: CommentDto,
    conn: Pool = this.pool
  ): Promise<CommentDto[]> {
    const commentsQueryResult = await conn.query(
      `SELECT comment.idx AS "commentIdx", account.name AS "userName", comment.content AS comment, comment."createdAt", comment."countLike" AS "cntCommentLike"
        FROM project.comment 
        JOIN project.account ON comment."accountIdx" = account.idx 
        WHERE comment."postIdx" = $1 
        ORDER BY comment."createdAt" DESC`,
      [commentDto.postIdx]
    );

    return new CommentDto().getCommentsDto(commentsQueryResult.rows);
  }

  async getIsCommentLike(
    commentDto: CommentDto,
    conn: Pool = this.pool
  ): Promise<any[]> {
    const commentLikeQueryResult = await conn.query(
      `SELECT * FROM project."commentLike" WHERE "commentIdx" = $1 AND "accountIdx" = $2`,
      [commentDto.commentIdx, commentDto.accountIdx]
    );

    return commentLikeQueryResult.rows;
  }

  async deleteComment(
    commentDto: CommentDto,
    conn: Pool = this.pool
  ): Promise<void> {
    await conn.query(`DELETE FROM project.comment WHERE idx = $1`, [
      commentDto.commentIdx,
    ]);
  }

  async deleteCommentLike(
    commentDto: CommentDto,
    conn: Pool = this.pool
  ): Promise<void> {
    await conn.query(`BEGIN`);
    await conn.query(
      `DELETE FROM project."commentLike" WHERE "commentIdx" = $1 AND "accountIdx" = $2`,
      [commentDto.commentIdx, commentDto.accountIdx]
    );
    await conn.query(
      `UPDATE project.comment SET "countLike" = (
          SELECT COUNT(*)
          FROM project."commentLike" 
          JOIN project.comment ON "commentLike"."commentIdx" = comment.idx
          ) WHERE idx = $1`,
      [commentDto.commentIdx]
    );
    await conn.query(`COMMIT`);
  }
}
