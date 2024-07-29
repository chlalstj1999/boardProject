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
    try {
      const conn = await pool.connect();

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
    }
  };

  static selectCategorys = async () => {
    try {
      const conn = await pool.connect();

      const categorys = await CategorysRepository.getCategorys(conn);

      return categorys;
    } catch (err) {
      throw err;
    }
  };

  static updateCategory = async (updateCategoryDto: UpdateCategoryDto) => {
    try {
      const conn = await pool.connect();

      const updateCategoryDao = new UpdateCategoryDao({
        categoryIdx: updateCategoryDto.categoryIdx,
        categoryName: updateCategoryDto.categoryName,
      });

      const isCategory = await CategorysRepository.selectByIdx(
        updateCategoryDao.categoryIdx,
        conn
      );

      if (isCategory.length === 0) {
        throw new NotFoundException("categoryIdx에 해당하는 데이터가 없음");
      }

      const duplicateCategory =
        await CategorysRepository.selectCategoryExclutionIdx(
          updateCategoryDao,
          conn
        );

      if (duplicateCategory.length !== 0) {
        throw new ConflictException("카테고리가 이미 있음");
      }

      await CategorysRepository.putCategory(updateCategoryDto, conn);
    } catch (err) {
      throw err;
    }
  };

  static deleteCategory = async (categoryIdx: number) => {
    try {
      const conn = await pool.connect();

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
    }
  };
}
