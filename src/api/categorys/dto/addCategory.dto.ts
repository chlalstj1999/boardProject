import { regx } from "../../../common/const/regx";
import { BadRequestException } from "../../../common/exception/BadRequestException";

export class AddCategoryDto {
  categoryName: string;

  constructor(categoryName: string) {
    this.categoryName = categoryName;
  }

  static checkAddCategoryDto = (categoryName: string) => {
    if (!categoryName.match(regx.categoryNameRegx)) {
      throw new BadRequestException("카테고리 이름 확인 필요");
    }
  };
}
