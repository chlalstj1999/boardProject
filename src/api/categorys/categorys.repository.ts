import { PoolClient } from "pg";
import { InsertCategoryDao } from "./dao/insertCategory.dao";
import { GetCategoryDao } from "./dao/getCategorys.dao";
import { UpdateCategoryDto } from "./dto/updateCategory.dto";
import { UpdateCategoryDao } from "./dao/updateCateogry.dao";
import { DeleteCategoryDao } from "./dao/deleteCategory.dao";

export class CategorysRepository {
  static selectByCategoryName = async (
    categoryName: string,
    conn: PoolClient
  ) => {
    try {
      return await GetCategoryDao.selectByCategoryName(categoryName, conn);
    } catch (err) {
      throw err;
    }
  };

  static addCategory = async (categoryName: string, conn: PoolClient) => {
    try {
      await InsertCategoryDao.addCategory(categoryName, conn);
    } catch (err) {
      throw err;
    }
  };

  static getCategorys = async (conn: PoolClient) => {
    try {
      return await GetCategoryDao.selectCategorys(conn);
    } catch (err) {
      throw err;
    }
  };

  static selectByIdx = async (categoryIdx: number, conn: PoolClient) => {
    try {
      return await GetCategoryDao.selectByIdx(categoryIdx, conn);
    } catch (err) {
      throw err;
    }
  };

  static selectCategoryExclutionIdx = async (
    updateCategoryDao: UpdateCategoryDao,
    conn: PoolClient
  ) => {
    try {
      return await GetCategoryDao.selectCategoryExclutionIdx(
        updateCategoryDao,
        conn
      );
    } catch (err) {
      throw err;
    }
  };

  static putCategory = async (
    updateCategoryDto: UpdateCategoryDto,
    conn: PoolClient
  ) => {
    try {
      await UpdateCategoryDao.updateCategory(
        {
          categoryIdx: updateCategoryDto.categoryIdx,
          categoryName: updateCategoryDto.categoryName,
        },
        conn
      );
    } catch (err) {
      throw err;
    }
  };

  static deleteCategory = async (categoryIdx: number, conn: PoolClient) => {
    try {
      await DeleteCategoryDao.deleteCategory(categoryIdx, conn);
    } catch (err) {
      throw err;
    }
  };
}
