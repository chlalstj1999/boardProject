import { regx } from "../../../common/const/regx";
import { BadRequestException } from "../../../common/exception/BadRequestException";

export class PutCommentDto {
  accountIdx: number;
  commentIdx: number;
  comment: string;

  constructor(data: {
    accountIdx: number;
    commentIdx: number;
    comment: string;
  }) {
    this.accountIdx = data.accountIdx;
    this.commentIdx = data.commentIdx;
    this.comment = data.comment;
  }

  static checkPutCommentDto(data: PutCommentDto) {
    if (!data.comment.match(regx.commentRegx)) {
      throw new BadRequestException("댓글 확인 필요");
    }
  }
}
