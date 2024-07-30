import { regx } from "../../../common/const/regx";
import { BadRequestException } from "../../../common/exception/BadRequestException";

export class AddPostDto {
  accountIdx: number;
  categoryIdx: number;
  title: string;
  content: string;

  constructor(data: {
    accountIdx: number;
    categoryIdx: number;
    title: string;
    content: string;
  }) {
    this.accountIdx = data.accountIdx;
    this.categoryIdx = data.categoryIdx;
    this.title = data.title;
    this.content = data.content;
  }

  static checkAddPostDto(data: AddPostDto) {
    if (!data.title.match(regx.postTitleRegx)) {
      throw new BadRequestException("제목 확인 필요");
    }

    if (!data.title.match(regx.postContentRegx)) {
      throw new BadRequestException("게시글 내용 확인 필요");
    }
  }
}
