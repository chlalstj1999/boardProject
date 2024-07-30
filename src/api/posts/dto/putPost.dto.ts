import { regx } from "../../../common/const/regx";
import { BadRequestException } from "../../../common/exception/BadRequestException";

export class PutPostDto {
  accountIdx: number;
  postIdx: number;
  title: string;
  content: string;

  constructor(data: {
    accountIdx: number;
    postIdx: number;
    title: string;
    content: string;
  }) {
    this.accountIdx = data.accountIdx;
    this.postIdx = data.postIdx;
    this.title = data.title;
    this.content = data.content;
  }

  static checkPutPostDto(data: PutPostDto) {
    if (!data.title.match(regx.postTitleRegx)) {
      throw new BadRequestException("제목 확인 필요");
    }

    if (!data.title.match(regx.postContentRegx)) {
      throw new BadRequestException("게시글 내용 확인 필요");
    }
  }
}
