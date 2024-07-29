import { PoolClient } from "pg";
import { UpdateCategoryDao } from "./updateCateogry.dao";

export class GetCategoryDao {
  static selectByCategoryName = async (
    categoryName: string,
    conn: PoolClient
  ) => {
    const category = await conn.query(
      `SELECT 1 FROM project.category WHERE name = $1`,
      [categoryName]
    );
    const categoryRows = category.rows;

    return categoryRows.length !== 0 ? categoryRows[0] : [];
  };

  static selectCategorys = async (conn: PoolClient) => {
    const categorys = await conn.query(`SELECT * FROM project.category`);
    const categorysRows = categorys.rows;

    return categorysRows.length !== 0 ? categorysRows : [];
  };

  static selectByIdx = async (categoryIdx: number, conn: PoolClient) => {
    const category = await conn.query(
      `SELECT * FROM project.category WHERE idx = $1`,
      [categoryIdx]
    );
    const categoryRows = category.rows;

    return categoryRows.length !== 0 ? categoryRows[0] : [];
  };

  static selectCategoryExclutionIdx = async (
    updateCategoryDao: UpdateCategoryDao,
    conn: PoolClient
  ) => {
    const category = await conn.query(
      `SELECT name FROM project.category WHERE name = $1 AND idx != $2`,
      [updateCategoryDao.categoryName, updateCategoryDao.categoryIdx]
    );
    const categoryRows = category.rows;

    return categoryRows.length !== 0 ? categoryRows[0] : [];
  };
}
