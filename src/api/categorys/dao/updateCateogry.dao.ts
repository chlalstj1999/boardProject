import { PoolClient } from "pg";

export class UpdateCategoryDao {
  categoryIdx: number;
  categoryName: string;

  constructor(data: { categoryIdx: number; categoryName: string }) {
    this.categoryIdx = data.categoryIdx;
    this.categoryName = data.categoryName;
  }

  static updateCategory = async (
    updateCategoryDao: UpdateCategoryDao,
    conn: PoolClient
  ) => {};
}
