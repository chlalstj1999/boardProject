import { PoolClient } from "pg";

export class DeleteCategoryDao {
  static deleteCategory = async (categoryIdx: number, conn: PoolClient) => {
    await conn.query(`DELETE FROM project.category WHERE idx = $1`, [
      categoryIdx,
    ]);
  };
}
