import { Pool } from "pg";
import { PostDto } from "../dto/post.dto";

interface IpostRepository {
  getPostLists(getPostListsDto: PostDto, conn: Pool): Promise<PostDto[]>;

  addPost(addPostDto: PostDto, conn: Pool): Promise<void>;

  addPostLike(addPostLikeDto: PostDto, conn: Pool): Promise<void>;

  getPostByTitle(postDto: PostDto, conn: Pool): Promise<any[]>;

  isPost(postDto: PostDto, conn: Pool): Promise<PostDto>;

  getPost(postDto: PostDto, conn: Pool): Promise<PostDto>;

  getPostByTitleExIdx(postDto: PostDto, conn: Pool): Promise<any[]>;

  getIsPostLike(postDto: PostDto, conn: Pool): Promise<any[]>;

  putPost(postDto: PostDto, conn: Pool): Promise<void>;

  deletePost(postDto: PostDto, conn: Pool): Promise<void>;

  deletePostLike(postDto: PostDto, conn: Pool): Promise<void>;
}

export class PostRepository implements IpostRepository {
  constructor(private readonly pool: Pool) {}

  async getPostLists(
    postDto: PostDto,
    conn: Pool = this.pool
  ): Promise<PostDto[]> {
    const postsQueryResult = await conn.query(
      `SELECT post.idx AS "postIdx", account.name AS "userName", post.title, post."createdAt" 
        FROM project.post 
        JOIN project.account ON "accountIdx" = account.idx 
        WHERE "categoryIdx" = $1 
        ORDER BY post."createdAt" DESC`,
      [postDto.categoryIdx]
    );

    return new PostDto().getPostListsDto(postsQueryResult.rows);
  }

  async addPost(postDto: PostDto, conn: Pool = this.pool): Promise<void> {
    await conn.query("BEGIN");
    const postIdxQueryResult = await conn.query(
      `INSERT INTO project.post ("accountIdx", title, content, "categoryIdx", "countLike") VALUES ($1, $2, $3, $4, $5) RETURNING idx`,
      [
        postDto.accountIdx,
        postDto.title,
        postDto.content,
        postDto.categoryIdx,
        postDto.likes,
      ]
    );

    const postIdx = postIdxQueryResult.rows[0].idx;

    if (postDto.imageUrls && postDto.imageUrls?.length !== 0) {
      for (let i = 0; i < postDto.imageUrls.length; i++) {
        await conn.query(
          `INSERT INTO project.image ("postIdx", "imageUrl", "imageOrder") VALUES ($1, $2, $3)`,
          [postIdx, postDto.imageUrls[i], i + 1]
        );
      }
    }

    await conn.query("COMMIT");
  }

  async addPostLike(postDto: PostDto, conn: Pool = this.pool): Promise<void> {
    await conn.query(`BEGIN`);
    await conn.query(
      `INSERT INTO project."postLike" ("postIdx", "accountIdx") VALUES ($1, $2)`,
      [postDto.postIdx, postDto.accountIdx]
    );

    await conn.query(
      `UPDATE project.post SET "countLike" = (
      SELECT COUNT(*)
      FROM project."postLike" 
      JOIN project.post ON "postLike"."postIdx" = post.idx
      ) WHERE idx = $1`,
      [postDto.postIdx]
    );
    await conn.query(`COMMIT`);
  }

  async getPostByTitle(
    postDto: PostDto,
    conn: Pool = this.pool
  ): Promise<any[]> {
    const postQueryResult = await conn.query(
      `SELECT 1 FROM project.post WHERE title = $1 AND idx != $2`,
      [postDto.title, postDto.postIdx]
    );

    return postQueryResult.rows;
  }

  async isPost(postDto: PostDto, conn: Pool = this.pool): Promise<PostDto> {
    const postQueryResult = await conn.query(
      `SELECT "accountIdx" FROM project.post WHERE idx = $1`,
      [postDto.postIdx]
    );

    if (postQueryResult.rows.length !== 0) {
      postDto.authorIdx = postQueryResult.rows[0].accountIdx;
    }

    return postDto;
  }

  async getPost(postDto: PostDto, conn: Pool = this.pool): Promise<PostDto> {
    await conn.query("BEGIN");
    const postQueryResult = await conn.query(
      `SELECT post.idx AS "postIdx", account.name AS "userName", post.title, post.content, post."createdAt", post."countLike" AS "cntPostLike"
      FROM project.post 
      JOIN project.account ON post."accountIdx" = account.idx 
      WHERE post.idx = $1`,
      [postDto.postIdx]
    );

    if (postQueryResult.rows.length !== 0) {
      postDto.postIdx = postQueryResult.rows[0].postIdx;
      postDto.author = postQueryResult.rows[0].userName;
      postDto.title = postQueryResult.rows[0].title;
      postDto.content = postQueryResult.rows[0].content;
      postDto.createdAt = postQueryResult.rows[0].createdAt;
    }

    const imageQueryResult = await conn.query(
      `SELECT "imageUrl" FROM project.image WHERE "postIdx" = $1 ORDER BY "imageOrder" ASC;`,
      [postDto.postIdx]
    );
    await conn.query("COMMIT");

    if (imageQueryResult.rows.length !== 0) {
      postDto.imageUrls = [];

      for (let i = 0; i < imageQueryResult.rows.length; i++) {
        postDto.imageUrls?.push(imageQueryResult.rows[i].imageUrl);
      }
    }

    return postDto;
  }

  async getPostByTitleExIdx(
    postDto: PostDto,
    conn: Pool = this.pool
  ): Promise<any[]> {
    const postQueryResult = await conn.query(
      `SELECT 1 FROM project.post WHERE title = $1 AND idx != $2`,
      [postDto.title, postDto.postIdx]
    );

    return postQueryResult.rows;
  }

  async getIsPostLike(
    postDto: PostDto,
    conn: Pool = this.pool
  ): Promise<any[]> {
    const postLikeQueryResult = await conn.query(
      `SELECT 1 FROM project."postLike" WHERE "postIdx" = $1 AND "accountIdx" = $2`,
      [postDto.postIdx, postDto.accountIdx]
    );

    return postLikeQueryResult.rows;
  }

  async putPost(postDto: PostDto, conn: Pool = this.pool): Promise<void> {
    await conn.query("BEGIN");
    await conn.query(
      `UPDATE project.post SET title = $1, content = $2 WHERE idx = $3`,
      [postDto.title, postDto.content, postDto.postIdx]
    );
    await conn.query(`COMMIT`);
  }

  async deletePost(postDto: PostDto, conn: Pool = this.pool): Promise<void> {
    const imageQueryResult = await conn.query(
      `SELECT "imageUrl" FROM project.image WHERE "postIdx" = $1 ORDER BY "imageOrder" ASC;`,
      [postDto.postIdx]
    );

    postDto.imageUrls = [];

    if (imageQueryResult.rows.length !== 0) {
      for (let i = 0; i < imageQueryResult.rows.length; i++) {
        postDto.imageUrls?.push(imageQueryResult.rows[i].imageUrl);
      }
    }

    await conn.query("BEGIN");
    await conn.query(`DELETE FROM project.post WHERE idx = $1`, [
      postDto.postIdx,
    ]);
    await conn.query("COMMIT");
    await conn.query(`DELETE FROM project.image WHERE "postIdx" = $1`, [
      postDto.postIdx,
    ]);

    await conn.query("COMMIT");
  }

  async deletePostLike(
    postDto: PostDto,
    conn: Pool = this.pool
  ): Promise<void> {
    await conn.query(`BEGIN`);
    await conn.query(
      `DELETE FROM project."postLike" WHERE "postIdx" = $1 AND "accountIdx" = $2`,
      [postDto.postIdx, postDto.accountIdx]
    );
    await conn.query(
      `UPDATE project.post SET "countLike" = (
      SELECT COUNT(*)
      FROM project."postLike" 
      JOIN project.post ON "postLike"."postIdx" = post.idx
      ) WHERE idx = $1`,
      [postDto.postIdx]
    );
    await conn.query(`COMMIT`);
  }
}
