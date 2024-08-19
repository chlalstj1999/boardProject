interface IcommentDto {
  postIdx?: number;
  accountIdx?: number;
  commentIdx?: number;
  comment?: string;
  likes?: number;
  createdAt?: Date;
  authorIdx?: number;
  author?: string;
}

interface IcommentResponseDto {
  getCommentsDto(
    data: {
      postIdx: number;
      userName: string;
      comment: string;
      createdAt: Date;
      countLike: number;
    }[]
  ): CommentDto[];
}

export class CommentDto implements IcommentDto, IcommentResponseDto {
  postIdx?: number;
  accountIdx?: number;
  commentIdx?: number;
  comment?: string;
  likes?: number;
  createdAt?: Date;
  authorIdx?: number;
  author?: string;

  constructor(data?: Partial<IcommentDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  getCommentsDto(
    data: {
      postIdx: number;
      userName: string;
      comment: string;
      createdAt: Date;
      countLike: number;
    }[]
  ): CommentDto[] {
    return data.map((item) => {
      const commentDto = new CommentDto();
      commentDto.postIdx = item.postIdx;
      commentDto.author = item.userName;
      commentDto.comment = item.comment;
      commentDto.createdAt = item.createdAt;
      commentDto.likes = item.countLike;
      return commentDto;
    });
  }
}
