import { regx } from "../../../common/const/regx";
import { BadRequestException } from "../../../common/exception/BadRequestException";

export class UpdateCategoryDto {
  categoryIdx: number;
  categoryName: string;

  constructor(data: { categoryIdx: number; categoryName: string }) {
    this.categoryIdx = data.categoryIdx;
    this.categoryName = data.categoryName;
  }

  static checkUpdateCategoryDto = (categoryName: string) => {
    if (!categoryName.match(regx.categoryNameRegx)) {
      throw new BadRequestException("카테고리 이름 확인 필요");
    }
  };
}
