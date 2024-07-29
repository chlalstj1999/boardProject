import { PoolClient } from "pg";

export class InsertCategoryDao {
  categoryName: string;

  constructor(categoryName: string) {
    this.categoryName = categoryName;
  }

  static addCategory = async (categoryName: string, conn: PoolClient) => {
    await conn.query(`INSERT INTO project.category (name) VALUES ($1)`, [
      categoryName,
    ]);
  };
}
