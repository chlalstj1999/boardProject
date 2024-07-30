import pool from "../../common/database/postgre";
import { AddCategoryDto } from "./dto/addCategory.dto";
import { ConflictException } from "../../common/exception/ConflictException";
import { CategorysRepository } from "./categorys.repository";
import { UpdateCategoryDto } from "./dto/updateCategory.dto";
import { InsertCategoryDao } from "./dao/insertCategory.dao";
import { UpdateCategoryDao } from "./dao/updateCateogry.dao";
import { NotFoundException } from "../../common/exception/NotFoundException";

export class CategorysService {
  static createCategory = async (addCategoryDto: AddCategoryDto) => {
    const conn = await pool.connect();

    try {
      const insertCategoryDao = new InsertCategoryDao(
        addCategoryDto.categoryName
      );
      const duplicateCategory = await CategorysRepository.selectByCategoryName(
        insertCategoryDao.categoryName,
        conn
      );

      if (duplicateCategory.length !== 0) {
        throw new ConflictException("카테고리가 이미 있음");
      }

      await CategorysRepository.addCategory(
        insertCategoryDao.categoryName,
        conn
      );
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static selectCategorys = async () => {
    const conn = await pool.connect();

    try {
      return await CategorysRepository.getCategorys(conn);
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static updateCategory = async (updateCategoryDto: UpdateCategoryDto) => {
    const conn = await pool.connect();

    try {
      const isCategory = await CategorysRepository.selectByIdx(
        updateCategoryDto.categoryIdx,
        conn
      );

      if (isCategory.length === 0) {
        throw new NotFoundException("categoryIdx에 해당하는 데이터가 없음");
      }

      const duplicateCategory =
        await CategorysRepository.selectCategoryExclutionIdx(
          updateCategoryDto,
          conn
        );

      if (duplicateCategory.length !== 0) {
        throw new ConflictException("카테고리가 이미 있음");
      }

      await CategorysRepository.putCategory(
        {
          categoryIdx: updateCategoryDto.categoryIdx,
          categoryName: updateCategoryDto.categoryName,
        },
        conn
      );
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };

  static deleteCategory = async (categoryIdx: number) => {
    const conn = await pool.connect();

    try {
      const isCategory = await CategorysRepository.selectByIdx(
        categoryIdx,
        conn
      );

      if (isCategory.length === 0) {
        throw new NotFoundException("categoryIdx에 해당하는 데이터가 없음");
      }

      const categorys = await CategorysRepository.deleteCategory(
        categoryIdx,
        conn
      );

      return categorys;
    } catch (err) {
      throw err;
    } finally {
      conn.release();
    }
  };
}
