import { Pool } from "pg";
import { ConflictException } from "../../common/exception/ConflictException";
import { NotFoundException } from "../../common/exception/NotFoundException";
import { CategoryRepository } from "./dao/category.dao";
import { CategoryDto } from "./dto/category.dto";

interface ICategorysService {
  createCategory(categoryDto: CategoryDto): Promise<void>;
  selectCategorys(categoryDto: CategoryDto): Promise<{}[]>;
  updateCategory(categoryDto: CategoryDto): Promise<void>;
  deleteCategory(categoryDto: CategoryDto): Promise<void>;
}

export class CategorysService implements ICategorysService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly pool: Pool
  ) {}

  async createCategory(categoryDto: CategoryDto): Promise<void> {
    const duplicateCategory =
      await this.categoryRepository.selectByCategoryName(
        categoryDto,
        this.pool
      );

    if (duplicateCategory.length !== 0) {
      throw new ConflictException("카테고리가 이미 있음");
    }

    await this.categoryRepository.addCategory(categoryDto, this.pool);
  }

  async selectCategorys(): Promise<{}[]> {
    return await this.categoryRepository.selectCategorys(this.pool);
  }

  async updateCategory(categoryDto: CategoryDto): Promise<void> {
    const isCategory = await this.categoryRepository.selectByIdx(
      categoryDto,
      this.pool
    );

    if (isCategory.length === 0) {
      throw new NotFoundException("categoryIdx에 해당하는 데이터가 없음");
    }

    const duplicateCategory =
      await this.categoryRepository.selectCategoryExclutionIdx(
        categoryDto,
        this.pool
      );

    if (duplicateCategory.length !== 0) {
      throw new ConflictException("카테고리가 이미 있음");
    }

    await this.categoryRepository.updateCategory(categoryDto, this.pool);
  }

  async deleteCategory(categoryDto: CategoryDto): Promise<void> {
    const isCategory = await this.categoryRepository.selectByIdx(
      categoryDto,
      this.pool
    );

    if (isCategory.length === 0) {
      throw new NotFoundException("categoryIdx에 해당하는 데이터가 없음");
    }

    await this.categoryRepository.deleteCategory(categoryDto, this.pool);
  }
}
