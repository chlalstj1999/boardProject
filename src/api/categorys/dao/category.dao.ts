import { Pool } from "pg";
import { CategoryDto } from "../dto/category.dto";

interface IcategoryRepository {
  addCategory(categoryDto: CategoryDto, conn: Pool): Promise<void>;
  updateCategory(categoryDto: CategoryDto, conn: Pool): Promise<void>;
  selectByCategoryName(categoryDto: CategoryDto, conn: Pool): Promise<any[]>;
  selectCategorys(conn: Pool): Promise<CategoryDto[]>;
  selectByIdx(categoryDto: CategoryDto, conn: Pool): Promise<any[]>;
  selectCategoryExclutionIdx(
    categoryDto: CategoryDto,
    conn: Pool
  ): Promise<any[]>;
  deleteCategory(categoryDto: CategoryDto, conn: Pool): Promise<void>;
}

export class CategoryRepository implements IcategoryRepository {
  constructor(private readonly pool: Pool) {}

  async addCategory(
    categoryDto: CategoryDto,
    conn: Pool = this.pool
  ): Promise<void> {
    await conn.query(`INSERT INTO project.category (name) VALUES ($1)`, [
      categoryDto.categoryName,
    ]);
  }

  async updateCategory(
    categoryDto: CategoryDto,
    conn: Pool = this.pool
  ): Promise<void> {
    await conn.query(`UPDATE project.category SET name = $1 WHERE idx = $2`, [
      categoryDto.categoryName,
      categoryDto.categoryIdx,
    ]);
  }

  async selectByCategoryName(
    categoryDto: CategoryDto,
    conn: Pool = this.pool
  ): Promise<any[]> {
    const categoryQueryResult = await conn.query(
      `SELECT 1 FROM project.category WHERE name = $1`,
      [categoryDto.categoryName]
    );

    return categoryQueryResult.rows;
  }

  async selectCategorys(conn: Pool = this.pool): Promise<CategoryDto[]> {
    const categorysQueryResult = await conn.query(
      `SELECT * FROM project.category`
    );

    return new CategoryDto().getCategorysDto(categorysQueryResult.rows);
  }

  async selectByIdx(
    categoryDto: CategoryDto,
    conn: Pool = this.pool
  ): Promise<any[]> {
    const categoryQueryResult = await conn.query(
      `SELECT 1 FROM project.category WHERE idx = $1`,
      [categoryDto.categoryIdx]
    );

    return categoryQueryResult.rows;
  }

  async selectCategoryExclutionIdx(
    categoryDto: CategoryDto,
    conn: Pool = this.pool
  ): Promise<any[]> {
    const categoryQueryResult = await conn.query(
      `SELECT 1 WHERE name = $1 AND idx != $2`,
      [categoryDto.categoryName, categoryDto.categoryIdx]
    );

    return categoryQueryResult.rows;
  }

  async deleteCategory(
    categoryDto: CategoryDto,
    conn: Pool = this.pool
  ): Promise<void> {
    await conn.query(`DELETE FROM project.category WHERE idx = $1`, [
      categoryDto.categoryIdx,
    ]);
  }
}
