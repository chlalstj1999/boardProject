import { regx } from "../../../common/const/regx";
import { BadRequestException } from "../../../common/exception/BadRequestException";

export class AddCommentDto {
  accountIdx: number;
  postIdx: number;
  comment: string;

  constructor(data: { accountIdx: number; postIdx: number; comment: string }) {
    this.accountIdx = data.accountIdx;
    this.postIdx = data.postIdx;
    this.comment = data.comment;
  }

  static checkAddCommentDto(data: AddCommentDto) {
    if (!data.comment.match(regx.commentRegx)) {
      throw new BadRequestException("댓글 확인 필요");
    }
  }
}
